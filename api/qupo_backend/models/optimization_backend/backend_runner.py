# native packages
from dataclasses import dataclass
from dotenv import load_dotenv
from enum import Enum
import os
import warnings

# 3rd party packages
from azure.quantum import Workspace
from azure.quantum.qiskit import AzureQuantumProvider
from azure.identity import ClientSecretCredential
from azure.quantum.optimization import (SimulatedAnnealing, PopulationAnnealing, ParallelTempering, Tabu,
                                        QuantumMonteCarlo, SubstochasticMonteCarlo)
import numpy as np
import osqp
import pypfopt
from qiskit import IBMQ
from qiskit import Aer
from qiskit.algorithms import QAOA
from qiskit.algorithms.optimizers import COBYLA
from qiskit.utils import QuantumInstance
from qiskit.providers.ibmq import IBMQAccountError
from qiskit_optimization.algorithms import MinimumEigenOptimizer

# custom packages
from .optimization_classes import Result
from .model_converter import convert_qubo_to_azureqio_model

load_dotenv()


def run_job(job):
    try:
        variable_values, objective_value, time_to_solution = Providers(job.solver.provider_name).run_job(job)
    except TypeError:
        warnings.warn(f'Provider {job.solver.provider_name} not available')
    try:
        job.result = Result(variable_values * 100, objective_value, time_to_solution)
    except TypeError:
        warnings.warn('Solver did not return variable values')


def run_pypo_job(job):
    df = job.problem.dataframe
    efficient_frontier = pypfopt.efficient_frontier.EfficientFrontier(df.RateOfReturn, df.iloc[:, -len(df.index):])
    raw_result = efficient_frontier.max_quadratic_utility(risk_aversion=job.problem.risk_weight, market_neutral=False)
    variable_values = np.array(list(raw_result.values()))
    objective_value = job.problem.calc_objective_value(variable_values)
    time_to_solution = None
    return variable_values, objective_value, time_to_solution


def run_osqp_job(job):
    osqp_job = osqp.OSQP()

    # Setup workspace and change alpha parameter
    osqp_job.setup(job.problem.P, job.problem.q, job.problem.A, job.problem.l, job.problem.u,
                   alpha=1, polish=True, eps_rel=1E-10, max_iter=100000)

    raw_result = osqp_job.solve()
    variable_values = raw_result.x
    objective_value = raw_result.info.obj_val
    time_to_solution = raw_result.info.run_time
    return variable_values, objective_value, time_to_solution


def configure_azure_provider(quantum=False):
    credential = ClientSecretCredential(tenant_id=os.getenv('AZURE_TENANT_ID'),
                                        client_id=os.getenv('AZURE_CLIENT_ID'),
                                        client_secret=os.getenv('AZURE_CLIENT_SECRET'))
    if quantum:
        azure_provider = AzureQuantumProvider(subscription_id=os.getenv('AZURE_SUBSCRIPTION_ID'),
                                              resource_group=os.getenv('AZURE_RESOURCE_GROUP'),
                                              name=os.getenv('AZURE_NAME'),
                                              location=os.getenv('AZURE_LOCATION'),
                                              credential=credential)
    else:
        azure_provider = Workspace(subscription_id=os.getenv('AZURE_SUBSCRIPTION_ID'),
                                   resource_group=os.getenv('AZURE_RESOURCE_GROUP'),
                                   name=os.getenv('AZURE_NAME'),
                                   location=os.getenv('AZURE_LOCATION'),
                                   credential=credential)
    return azure_provider


def run_qio_job(job):
    provider = configure_azure_provider()
    try:
        if job.solver.algorithm == 'SA':
            qio_solver = SimulatedAnnealing(provider, timeout=job.solver.config['timeout'],
                                            sweeps=2, beta_start=0.1, beta_stop=1, restarts=72, seed=22)
        elif job.solver.algorithm == 'PA':
            qio_solver = PopulationAnnealing(provider, timeout=job.solver.config['timeout'],
                                             seed=48)
        elif job.solver.algorithm == 'PT':
            qio_solver = ParallelTempering(provider, timeout=job.solver.config['timeout'],
                                           sweeps=2, all_betas=[1.15, 3.14], replicas=2, seed=22)
        elif job.solver.algorithm == 'Tabu':
            qio_solver = Tabu(provider, timeout=job.solver.config['timeout'], seed=22)
        elif job.solver.algorithm == 'QMC':
            qio_solver = QuantumMonteCarlo(provider, sweeps=2, trotter_number=10, restarts=72, beta_start=0.1,
                                           transverse_field_start=10, transverse_field_stop=0.1, seed=22)
        elif job.solver.algorithm == 'SMC':
            qio_solver = SubstochasticMonteCarlo(provider, timeout=job.solver.config['timeout'],
                                                 seed=48)
        else:
            warnings.warn('QIO solver not implemented - choose from: SA, PA, PT, Tabu, QMC, SMC')

        azure_qio_problem = convert_qubo_to_azureqio_model(job.problem.qubo_problem)
        result = qio_solver.optimize(azure_qio_problem)
        raw_result = job.problem.converter.interpret(list(result['configuration'].values())) * job.problem.resolution
        variable_values = raw_result
        objective_value = 0.5 * np.dot(variable_values, job.problem.P.dot(variable_values)) + np.dot(job.problem.q,
                                                                                                     variable_values)
        time_to_solution = job.solver.config['timeout']
        return variable_values, objective_value, time_to_solution
    except TypeError:
        # TODO: Handle properly
        warnings.warn(f'Qio job failed. Please check azure qio service health status and config: {job.solver.config}')
        return None, None, None


def configure_qiskit_provider():
    try:
        IBMQ.enable_account(os.environ['IBMQ_CLIENT_SECRET'])
        IBMQ.save_account(os.environ.get('IBMQ_CLIENT_SECRET'))
    except IBMQAccountError:
        warnings.warn('IBM account not available. Please check ibmq health status and credentials')
        pass
    provider = IBMQ.get_provider(
        hub='ibm-q',
        group='open',
        project='main'
    )
    return provider


def run_quantum_job(job, quantum_instance, repetitions):
    # Implementation according to https://qiskit.org/documentation/finance/tutorials/01_portfolio_optimization.html
    qp = job.problem.quadratic_problem
    cobyla = COBYLA()
    cobyla.set_options(maxiter=250)

    qaoa_algorithm = QAOA(optimizer=cobyla, reps=repetitions, quantum_instance=quantum_instance)
    qaoa = MinimumEigenOptimizer(qaoa_algorithm)
    raw_result = qaoa.solve(qp)
    variable_values = raw_result.x
    objective_value = 0.5 * np.dot(variable_values, job.problem.P.dot(variable_values)) + np.dot(job.problem.q,
                                                                                                 variable_values)
    time_to_solution = None

    return variable_values, objective_value, time_to_solution


def run_qiskit_job(job):
    configure_qiskit_provider()
    simulator_backend = Aer.get_backend('aer_simulator')
    seed = 42
    quantum_instance = QuantumInstance(backend=simulator_backend, seed_simulator=seed, seed_transpiler=seed)

    return run_quantum_job(job, quantum_instance, 3)


def run_ionq_job(job):
    provider = configure_azure_provider(quantum=True)
    simulator_backend = provider.get_backend('ionq.simulator')
    quantum_instance = QuantumInstance(backend=simulator_backend)

    return run_quantum_job(job, quantum_instance, 1)


@dataclass
class Providers(Enum):
    pypo = 'pypfopt'
    osqp = 'osqp'
    qio = 'azure_quantum_qio'
    qiskit = 'qiskit_ibm'
    ionq = 'azure_ionq'

    def run_job(self, job):
        return eval('run_' + self.name + '_job(job)')
