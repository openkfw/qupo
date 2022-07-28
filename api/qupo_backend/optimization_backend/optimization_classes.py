# native packages
from dataclasses import dataclass, field
from datetime import datetime
from scipy import sparse

# 3rd party packages
import numpy as np
import pandas as pd

# custom packages
import qupo_backend.finance_utilities as finance_utilities
import qupo_backend.optimization_backend.model_converter as model_converter


@dataclass
class Result:
    variables_values: float
    objective_value: float
    time_to_solution: float
    valid: bool = False
    rate_of_return: float = 0.0
    variance: float = 0.0
    esg_value: float = 0.0


@ dataclass
class Problem:
    '''
    Quadratic Optimization Problem according to
    OSQP (sparse matrix) notation for quadratic constrained problems:
    objective:      minimize 0.5*x^T*P*x + q*x
    constraints:    subject to l <= A*x <= u
    with            x - real valued vector (of variables x_i)
                    T - transpose operator
                    P - objective matrix
                    q - objective vector
                    l/u - constraint lower/upper bound vector
                    A - constraint matrix
    '''
    P: sparse.csc_matrix = sparse.csc_matrix((2, 2))
    q: np.ndarray = np.array([0, 0])
    A: sparse.csc_matrix = sparse.csc_matrix((2, 2))
    l: np.ndarray = np.array([0, 0])
    u: np.ndarray = np.array([1, 1])
    dataframe: pd.DataFrame = pd.DataFrame()
    risk_weight: float = 1
    esg_weight: float = 1
    resolution: float = 1

    def __post_init__(self):
        self.rms_covariance = np.round(self.P.power(2).sqrt().sum() / self.P.getnnz(), 2)
        self.num_variables = self.P.shape[0]
        self.num_constraints = len(self.l)
        self.sparsity = np.round(sum([tensor.getnnz() for tensor in [self.P, self.A]]) / sum(
            [tensor.shape[0] * tensor.shape[1] for tensor in [self.P, self.A]]) * 100, 2)
        if self.resolution is not None:
            self.docplex_problem = model_converter.convert_osqp_to_docplex_model(self.P, self.q, self.A, self.l, self.u,
                                                                     resolution=self.resolution)
            self.quadratic_problem, self.qubo_problem, self.converter = model_converter.approximate_docplex_by_qubo_model(
                self.docplex_problem)

    def calc_objective_value(self, variable_values):
        return 0.5 * np.dot(variable_values, self.P.dot(variable_values)) + np.dot(self.q, variable_values)


@ dataclass
class Solver:
    provider_name: str = 'not specified'
    algorithm: str = 'not specified'
    config: dict = field(default_factory=dict)


@ dataclass
class Job:
    problem: Problem
    solver: Solver
    result: Result = Result(0.0, 0.0, 0.0)
    timestamp: datetime = datetime.now()

    def parse_job_df(self, df):
        df = df.loc[df['DateTime'] == self.timestamp]
        df = df.iloc[:, 3:-5][df['Unnamed: 0'] == df['Unnamed: 0']]
        return df
