import dimod
import azure.quantum.optimization as azure_quantum_optimization
from docplex.mp.model import Model as docplexModel
import numpy as np
from qiskit_optimization.converters import QuadraticProgramToQubo as Qp2Qubo
from qiskit_optimization.translators import from_docplex_mp


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
    length_objective_vector = len(q)
    docplex_model = docplexModel('portfolio_optimization')
    x = docplex_model.integer_var_list(['x{}'.format(i) for i in range(length_objective_vector)], ub=discrete_u[-1])
    objective = docplex_model.sum([q[i] * x[i] for i in range(length_objective_vector)])
    objective += docplex_model.sum([P.todense()[i, j] * x[i] * x[j] for i in range(length_objective_vector) for j in range(length_objective_vector)])
    docplex_model.minimize(objective)
    A = np.array(A.todense())
    docplex_model.add_constraint(docplex_model.sum(A[-1][i] * x[i] for i in range(length_objective_vector)) == discrete_l[-1])
    return docplex_model


def approximate_docplex_by_qubo_model(dpx_model):
    # approximate the exact docplex model by a quadratic binary unconstrained model
    qp = from_docplex_mp(dpx_model)
    qp2qubo = Qp2Qubo()
    qubo = qp2qubo.convert(qp)
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
    qubo_terms = [azure_quantum_optimization.Term(c=term['c'], indices=term['ids']) for term in qubo_list]
    azure_quantum_optimization_model = azure_quantum_optimization.Problem(name='Supply Chain', problem_type=azure_quantum_optimization.ProblemType.pubo, terms=qubo_terms)
    return azure_quantum_optimization_model


def convert_qubo_to_dimod_model(qubo):
    # convert qubo model to a dwave input format
    qubo_dict_lin = qubo.objective.linear.to_dict()
    qubo_dict_quad = qubo.objective.quadratic.to_dict()
    bqm = dimod.BinaryQuadraticModel(qubo_dict_lin, qubo_dict_quad, 0, dimod.BINARY)
    return bqm


def convert_docplex_to_azureqio_model(dpx_model, penalty_factor=1E5):
    azuremodel = convert_qubo_to_azureqio_model(approximate_docplex_by_qubo_model(dpx_model))
    return azuremodel
