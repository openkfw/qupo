from dataclasses import dataclass
from datetime import datetime
import json
from xmlrpc.client import Boolean
import numpy as np
import pandas as pd
import pypfopt as ppo
from scipy import sparse
import warnings

def read_credentials():
    with open("qupo/api/env.json") as f:
        data = json.load(f)
    return {"credentials": data}

def run_job(job, filepath=None, experiment=None):
    credentials = read_credentials()
    if job.solver.provider_name == "PyPortfolioOptimization":
        raw_result, variable_values, objective_value, time_to_solution = run_pypo_job(job)
    else:
        warnings.warn(f"Provider {job.solver.provider_name} not available")
    job.result = Result(variable_values * 100, objective_value, time_to_solution)

def run_pypo_job(job):
    df = job.problem.dataframe
    efficient_frontier = ppo.efficient_frontier.EfficientFrontier(df.RateOfReturn, df.iloc[:, -len(df.index):])
    raw_result = efficient_frontier.max_quadratic_utility(risk_aversion=1/job.problem.risk_weight, market_neutral=False)
    variable_values = np.array(list(raw_result.values()))
    objective_value = job.problem.calc_objective_value(variable_values)
    time_to_solution = None
    return raw_result, variable_values, objective_value, time_to_solution

@dataclass
class Result:
    variables_values: np.float32 
    objective_value: np.float32 
    time_to_solution: np.float32
    valid: Boolean = False
    rate_of_return: np.float32 = None
    variance: np.float32 = None
    esg_value: np.float32 = None
    raw_result: object = None

class Problem:
    # osqp (sparse matrix) notation for quadratic constrained problems:
    # objective: minimize 0.5*x^T*P*x + q*x
    # constraints: subject to l <= A*x <= u
    # with T the transpose operator
    def __init__(self, P=sparse.csc_matrix((2,2)),
                 q=np.array([0,0]), A=sparse.csc_matrix((2,2)),
                 l=np.array([0,0]), u=np.array([1,1]),
                 dataframe=pd.DataFrame(), risk_weight=None, esg_weight=None):
        self.P = P
        self.q = q
        self.A = A
        self.l = l
        self.u = u
        self.dataframe = dataframe
        self.risk_weight = risk_weight
        self.esg_weight = esg_weight
        self.rms_covariance = np.round(P.power(2).sqrt().sum() / P.getnnz(), 2)
        self.num_variables = P.shape[0]
        self.num_constraints = len(l)
        self.sparsity = np.round(sum([tensor.getnnz() for tensor in [P, A]]) / sum(
            [tensor.shape[0] * tensor.shape[1] for tensor in [P, A]]) * 100, 2)
    def calc_objective_value(self, variable_values):
        return 0.5 * np.dot(variable_values, self.P.dot(variable_values)) + np.dot(self.q, variable_values)

class Solver:
    def __init__(self, provider_name='not specified', algorithm='not specified', config={}):
        self.provider_name = provider_name
        self.algorithm = algorithm
        self.config = config

@dataclass
class Job:
    problem: Problem
    solver: Solver
    datetime: datetime = datetime.now()
    result: Result = None

    def parse_job_df(self, df):
        df = df.loc[df['DateTime'] == self.datetime]
        df = df.iloc[:, 3:-5][df['Unnamed: 0'] == df['Unnamed: 0']]
        return df


