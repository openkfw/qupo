# 3rd party packages
import dimod
import azure.quantum.optimization as aqo
from docplex.mp.model import Model as dpxModel
import numpy as np
from qiskit_optimization.converters import QuadraticProgramToQubo as Qp2Qubo
from qiskit_optimization.translators import from_docplex_mp


def convert_osqp_to_docplex_model(P, qu, A, l, u, resolution=1E3):
    # create docplex model as basis for all quantum and quantum inspired models
    # https://qiskit.org/documentation/tutorials/optimization/1_quadratic_program.html
    l = resolution * l
    u = resolution * u
    n = len(qu)
    mdl = dpxModel('portfolio_optimization')
    x = mdl.integer_var_list(['x{}'.format(i) for i in range(n)], ub=resolution)
    objective = mdl.sum([qu[i] * x[i] for i in range(n)])
    objective += mdl.sum([P.todense()[i, j] * x[i] * x[j] for i in range(n) for j in range(n)])
    mdl.minimize(objective)
    A = np.array(A.todense())
    mdl.add_constraint(mdl.sum(A[-1][i] * x[i] for i in range(n)) == l[-1])
    return mdl


def approximate_docplex_by_qubo_model(dpx_model):
    # qp = qktQP()
    qp = from_docplex_mp(dpx_model)
    # %% Converting to QUBO using QISKit
    # print('\n[Converting to QUBO directly using QISKIT]')
    # qprob_eq_bin, int2bin = qktQP.lin2quad_qiskit_eq_bin(qp)
    # qubo = qktQP.lin2quad_qiskit_penalty(qprob_eq_bin, penalty_factor=penalty_factor)
    qp2qubo = Qp2Qubo()
    qubo = qp2qubo.convert(qp)
    return qp, qubo, qp2qubo


def convert_qubo_to_azureqio_model(qubo):
    # %% Converting QISKIT QUBO model Azure Quantum QUBO model
    qubo_dict_lin = qubo.objective.linear.to_dict()
    qubo_dict_quad = qubo.objective.quadratic.to_dict()
    # Convert keys to string
    qubo_list_lin = [{'c': float(value), 'ids': [int(key)]} for key, value in qubo_dict_lin.items()]
    qubo_list_quad = [{'c': float(value), 'ids': [int(key[0]), int(key[1])]} for key, value in qubo_dict_quad.items()]
    # Combine lists
    qubo_list = qubo_list_lin + qubo_list_quad
    qubo_terms = list()
    for term in qubo_list:
        qubo_terms = qubo_terms + [aqo.Term(c=term['c'], indices=term['ids'])]
    aqo_model = aqo.Problem(name='Supply Chain', problem_type=aqo.ProblemType.pubo, terms=qubo_terms)
    return aqo_model


def convert_qubo_to_dimod_model(qubo):
    # Convert QISKit model to dimod model
    qubo_dict_lin = qubo.objective.linear.to_dict()
    qubo_dict_quad = qubo.objective.quadratic.to_dict()
    bqm = dimod.BinaryQuadraticModel(qubo_dict_lin, qubo_dict_quad, 0, dimod.BINARY)
    return bqm


def convert_docplex_to_azureqio_model(dpx_model, penalty_factor=1E5):
    azuremodel = convert_qubo_to_azureqio_model(approximate_docplex_by_qubo_model(dpx_model))
    return azuremodel
