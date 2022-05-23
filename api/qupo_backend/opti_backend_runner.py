# native packages
from dataclasses import dataclass, field
from datetime import datetime
import warnings

# 3rd party packages
from azure.quantum import Workspace
from azure.quantum.qiskit import AzureQuantumProvider
from azure.identity import ClientSecretCredential
from azure.quantum.optimization import SimulatedAnnealing, PopulationAnnealing, ParallelTempering, \
    Tabu, QuantumMonteCarlo, SubstochasticMonteCarlo, HardwarePlatform
import numpy as np
import osqp
import pandas as pd
import pypfopt as ppo
from qiskit import IBMQ
from qiskit import Aer
from qiskit.algorithms import QAOA
from qiskit.algorithms.optimizers import COBYLA
# from qiskit.circuit.library.n_local import QAOAAnsatz
from qiskit.utils import QuantumInstance
from qiskit.providers.ibmq import IBMQAccountError
from qiskit_optimization.algorithms import MinimumEigenOptimizer
# from qiskit_optimization.converters import QuadraticProgramToQubo
from scipy import sparse

# custom packages
import qupo_backend.opti_model_converter as omc
from qupo_backend.config import read_credentials


def configure_azure_provider(credentials, quantum=False):
    credential = ClientSecretCredential(tenant_id=credentials['AZURE_TENANT_ID'],
                                        client_id=credentials['AZURE_CLIENT_ID'],
                                        client_secret=credentials['AZURE_CLIENT_SECRET'])
    if quantum:
        azure_provider = AzureQuantumProvider(subscription_id=credentials['AZURE_SUBSCRIPTION_ID'],
                                              resource_group=credentials['AZURE_RESOURCE_GROUP'],
                                              name=credentials['AZURE_NAME'],
                                              location=credentials['AZURE_LOCATION'],
                                              credential=credential)
    else:
        azure_provider = Workspace(subscription_id=credentials['AZURE_SUBSCRIPTION_ID'],
                                   resource_group=credentials['AZURE_RESOURCE_GROUP'],
                                   name=credentials['AZURE_NAME'],
                                   location=credentials['AZURE_LOCATION'],
                                   credential=credential)
    return azure_provider


def configure_qiskit_provider(credentials):
    try:
        IBMQ.enable_account(credentials['IBMQ_CLIENT_SECRET'])
    except IBMQAccountError:
        pass
    provider = IBMQ.get_provider(
        hub='ibm-q',
        group='open',
        project='main'
    )
    return provider


def run_job(job, filepath=None, experiment=None):
    if job.solver.provider_name == 'PyPortfolioOptimization':
        warnings.warn(f'{job.solver.provider_name} does not include sustainability measures in optimization')
        raw_result, variable_values, objective_value, time_to_solution = run_pypo_job(job)
    elif job.solver.provider_name == 'University of Oxford':
        raw_result, variable_values, objective_value, time_to_solution = run_osqp_job(job)
    elif job.solver.provider_name == 'Azure':
        raw_result, variable_values, objective_value, time_to_solution = run_azure_qio_job(job)
    elif job.solver.provider_name in ['IBM', 'IONQ']:
        raw_result, variable_values, objective_value, time_to_solution = run_qiskit_job(job)
    else:
        warnings.warn(f'Provider {job.solver.provider_name} not available')
        return
    job.result = Result(variable_values * 100, objective_value, time_to_solution)


def run_pypo_job(job):
    df = job.problem.dataframe
    efficient_frontier = ppo.efficient_frontier.EfficientFrontier(df.RateOfReturn, df.iloc[:, -len(df.index):])
    raw_result = efficient_frontier.max_quadratic_utility(risk_aversion=1 / job.problem.risk_weight, market_neutral=False)
    variable_values = np.array(list(raw_result.values()))
    objective_value = job.problem.calc_objective_value(variable_values)
    time_to_solution = None
    return raw_result, variable_values, objective_value, time_to_solution


def run_osqp_job(job):
    # Create an OSQP object
    osqp_job = osqp.OSQP()
    # Setup workspace and change alpha parameter
    osqp_job.setup(job.problem.P, job.problem.q, job.problem.A, job.problem.l, job.problem.u,
                   alpha=job.solver.config['alpha'], polish=True, eps_rel=1E-10, max_iter=100000)
    # Solve problem
    raw_result = osqp_job.solve()
    variable_values = raw_result.x
    objective_value = raw_result.info.obj_val
    time_to_solution = raw_result.info.run_time
    return raw_result, variable_values, objective_value, time_to_solution


def run_azure_qio_job(job):
    credentials = read_credentials()
    provider = configure_azure_provider(credentials)
    try:
        if job.solver.algorithm == 'SA':
            qio_solver = SimulatedAnnealing(provider, timeout=job.solver.config['timeout'],
                                            sweeps=2, beta_start=0.1, beta_stop=1, restarts=72, seed=22,
                                            platform=HardwarePlatform.FPGA)
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
        azure_qio_problem = omc.convert_qubo_to_azureqio_model(job.problem.qubo_problem)
        result = qio_solver.optimize(azure_qio_problem)
        raw_result = job.problem.converter.interpret(list(result['configuration'].values())) * job.problem.resolution
        variable_values = raw_result
        objective_value = 0.5 * np.dot(variable_values, job.problem.P.dot(variable_values)) + np.dot(job.problem.q,
                                                                                                     variable_values)
        time_to_solution = job.solver.config['timeout']
        return raw_result, variable_values, objective_value, time_to_solution
    except TypeError:
        warnings.warn(f'Qio job failed. Config: {job.solver.config}')
        return None, None, None, None


def run_qiskit_job(job):
    credentials = read_credentials()
    qp = job.problem.quadratic_problem
    # Implementation according to https://qiskit.org/documentation/finance/tutorials/01_portfolio_optimization.html
    if job.solver.provider_name == 'IBM':
        provider = configure_qiskit_provider(credentials)
        print([backend.name() for backend in provider.backends()])
        simulator_backend = Aer.get_backend('aer_simulator')
    elif job.solver.provider_name == 'IONQ':
        provider = configure_azure_provider(credentials, quantum=True)
        print([backend.name() for backend in provider.backends()])
        simulator_backend_list = provider.backends('ionq.simulator')
        simulator_backend = simulator_backend_list[0]

    # define COBYLA optimizer to handle convex continuous problems.
    seed = 42
    repetitions = 3
    cobyla = COBYLA()
    cobyla.set_options(maxiter=250)
    quantum_instance = QuantumInstance(backend=simulator_backend, seed_simulator=seed, seed_transpiler=seed)
    qaoa_algorithm = QAOA(optimizer=cobyla, reps=repetitions, quantum_instance=quantum_instance)
    qaoa = MinimumEigenOptimizer(qaoa_algorithm)
    raw_result = qaoa.solve(qp)

    variable_values = raw_result.x  # mc.convert_qubo_results(job.problem.converter, raw_result, job.problem.resolution)
    objective_value = 0.5 * np.dot(variable_values, job.problem.P.dot(variable_values)) + np.dot(job.problem.q,
                                                                                                 variable_values)
    time_to_solution = None

    return raw_result, variable_values, objective_value, time_to_solution


@dataclass
class Result:
    variables_values: float
    objective_value: float
    time_to_solution: float
    valid: bool = False
    rate_of_return: float = None
    variance: float = None
    esg_value: float = None
    raw_result: object = None


@dataclass
class Problem:
    '''
    OSQP (sparse matrix) notation for quadratic constrained problems:
    objective:      minimize 0.5*x^T*P*x + q*x
    constraints:    subject to l <= A*x <= u
                    with T the transpose operator
    '''
    P: sparse.csc_matrix = sparse.csc_matrix((2, 2))
    q: np.array = np.array([0, 0])
    A: sparse.csc_matrix = sparse.csc_matrix((2, 2))
    l: np.array = np.array([0, 0])
    u: np.array = np.array([1, 1])
    dataframe: pd.DataFrame = pd.DataFrame()
    risk_weight: float = None
    esg_weight: float = None
    resolution: float = None

    def __post_init__(self):
        self.rms_covariance = np.round(self.P.power(2).sqrt().sum() / self.P.getnnz(), 2)
        self.num_variables = self.P.shape[0]
        self.num_constraints = len(self.l)
        self.sparsity = np.round(sum([tensor.getnnz() for tensor in [self.P, self.A]]) / sum(
            [tensor.shape[0] * tensor.shape[1] for tensor in [self.P, self.A]]) * 100, 2)
        if self.resolution is not None:
            self.docplex_problem = omc.convert_osqp_to_docplex_model(self.P, self.q, self.A, self.l, self.u,
                                                                     resolution=self.resolution)
            self.quadratic_problem, self.qubo_problem, self.converter = omc.convert_docplex_to_qubo_model(
                self.docplex_problem)

    def calc_objective_value(self, variable_values):
        return 0.5 * np.dot(variable_values, self.P.dot(variable_values)) + np.dot(self.q, variable_values)


@dataclass
class Solver:
    provider_name: str = 'not specified'
    algorithm: str = 'not specified'
    config: dict = field(default_factory=dict)


@dataclass
class Job:
    problem: Problem
    solver: Solver
    timestamp: datetime = datetime.now()
    result: Result = None

    def parse_job_df(self, df):
        df = df.loc[df['DateTime'] == self.timestamp]
        df = df.iloc[:, 3:-5][df['Unnamed: 0'] == df['Unnamed: 0']]
        return df
