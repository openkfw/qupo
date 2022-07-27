import dimod
# TODO: AzureQuantumOptimization?
import azure.quantum.optimization as aqo
# TODO: docplexModel?
from docplex.mp.model import Model as dpxModel
import numpy as np
from qiskit_optimization.converters import QuadraticProgramToQubo as Qp2Qubo
from qiskit_optimization.translators import from_docplex_mp


# TODO: find better variable names
def convert_osqp_to_docplex_model(P, q, A, l, u, resolution=1E3):
    # input: osqp model of single period sustainable portfolio model without transaction costs
    # osqp (sparse matrix) notation for quadratic constrained problems:
    # objective: minimize 0.5*x^T*P*x + q*x
    # constraints: subject to l <= A*x <= u
    # with x - real valued vector (of variables x_i), T - transpose operator, P - objective matrix, q - objective vector, l/u - constraint lower/upper bound vector, A - constraint matrix
    # output: docplex model as basis for all quantum and quantum inspired models
    # https://qiskit.org/documentation/tutorials/optimization/1_quadratic_program.html
    discrete_l = resolution * l
    discrete_u = resolution * u
    # TODO: some sort of length?
    n = len(q)
    # TODO: mdl = docplex_model?
    mdl = dpxModel('portfolio_optimization')
    x = mdl.integer_var_list(['x{}'.format(i) for i in range(n)], ub=discrete_u)
    objective = mdl.sum([q[i] * x[i] for i in range(n)])
    objective += mdl.sum([P.todense()[i, j] * x[i] * x[j] for i in range(n) for j in range(n)])
    mdl.minimize(objective)
    A = np.array(A.todense())
    mdl.add_constraint(mdl.sum(A[-1][i] * x[i] for i in range(n)) == discrete_l[-1])
    return mdl


def approximate_docplex_by_qubo_model(dpx_model):
    # approximate the exact docplex model by a quadratic binary unconstrained model
    qp = from_docplex_mp(dpx_model)
    qp2qubo = Qp2Qubo()
    qubo = qp2qubo.convert(qp)
    # TODO: Why return all of them?
    return qp, qubo, qp2qubo


def convert_qubo_to_azureqio_model(qubo):
    qubo_dict_lin = qubo.objective.linear.to_dict()
    qubo_dict_quad = qubo.objective.quadratic.to_dict()
    # Convert keys to string
    qubo_list_lin = [{'c': float(value), 'ids': [int(key)]} for key, value in qubo_dict_lin.items()]
    qubo_list_quad = [{'c': float(value), 'ids': [int(key[0]), int(key[1])]} for key, value in qubo_dict_quad.items()]
    # Combine lists
    qubo_list = qubo_list_lin + qubo_list_quad
    qubo_terms = list()
    for term in qubo_list:
        # TODO: Append? Or list comprehension?
        qubo_terms = qubo_terms + [aqo.Term(c=term['c'], indices=term['ids'])]
    # TODO: qubo_terms = [aqo.Term(c=term['c'], indices=term['ids']) for term in qubo_list]
    aqo_model = aqo.Problem(name='Supply Chain', problem_type=aqo.ProblemType.pubo, terms=qubo_terms)
    return aqo_model


def convert_qubo_to_dimod_model(qubo):
    # convert qubo model to a dwave input format
    qubo_dict_lin = qubo.objective.linear.to_dict()
    qubo_dict_quad = qubo.objective.quadratic.to_dict()
    bqm = dimod.BinaryQuadraticModel(qubo_dict_lin, qubo_dict_quad, 0, dimod.BINARY)
    return bqm


def convert_docplex_to_azureqio_model(dpx_model, penalty_factor=1E5):
    azuremodel = convert_qubo_to_azureqio_model(approximate_docplex_by_qubo_model(dpx_model))
    return azuremodel
