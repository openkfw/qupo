import sys
import os.path
import numpy as np
from qupo_backend.models.optimization_backend.optimization_classes import Problem, Job, Solver
import qupo_backend.models.optimization_backend.backend_runner as backend_runner
import stockdata_integrator_runscript as sdi
import qupo_backend.models.finance_utilities as finance_utilities

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))


def main():
    RISK_WEIGHT = 0.0001
    ESG_WEIGHT = 0.0001
    portfolio_model_df = sdi.portfolios_df_from_default_stock_data()

    # create abstract representation of problem (to identify and leverage hidden structure)
    P, q, A, l, u = finance_utilities.convert_business_to_osqp_model(portfolio_model_df, risk_weight=RISK_WEIGHT, esg_weight=ESG_WEIGHT)
    problem = Problem(P, q, A, l, u, portfolio_model_df, RISK_WEIGHT, ESG_WEIGHT)

    # 0. Classical benchmark solution: instantiate, configure and run
    # 0.1 PyPortfolioOptimization (excl. sustainability measures)
    solver_pypo = Solver(provider_name='pypfopt', algorithm='pypo')
    job_pypo = Job(problem, solver_pypo)
    backend_runner.run_job(job_pypo)

    solution_output_percent = dict(zip(job_pypo.problem.dataframe.index, job_pypo.result.variable_values.round(2)))
    print(f'PyPO suggested portfolio composition[%]: {solution_output_percent}')
    print(f'PyPO objective value: {job_pypo.result.objective_value}')

    # 0.2 University of Oxford OSQP Solver (incl. sustainability measures)
    solver_osqp = Solver(provider_name='osqp', algorithm='osqp')
    job_osqp = Job(problem, solver_osqp)
    backend_runner.run_job(job_osqp)

    solution_output_percent = dict(zip(job_osqp.problem.dataframe.index, job_osqp.result.variable_values.round(2)))
    print(f'OSQP suggested portfolio composition[%]: {solution_output_percent}')
    print(f'OSQP objective value: {job_osqp.result.objective_value}')

    # 1. Quantization: generate generic quantum problem (quadratic unconstrained binary optimization problem),
    # instantiate and run qio
    for algorithm in ['PA']:  # ['SA', 'PT', 'PA', 'Tabu', 'QMC', 'SMC']:
        for resolution in np.array([1]) * 1:
            for timeout in [10]:  # 60, 10, 1]:
                quantum_problem = Problem(P, q, A, l, u, portfolio_model_df, RISK_WEIGHT, ESG_WEIGHT, resolution=resolution)
                solver_qio = Solver(provider_name='azure_quantum_qio', algorithm=algorithm, config={'timeout': timeout, 'hardware': 'FPGA'})
                job_qio = Job(quantum_problem, solver_qio)
                backend_runner.run_job(job_qio)

                solution_output_percent = dict(zip(job_pypo.problem.dataframe.index, job_pypo.result.variable_values.round(2)))
                print(f'Azure QIO suggested portfolio composition[%]: {solution_output_percent}')
                print(f'Azure QIO objective value: {job_pypo.result.objective_value}')

    # 2. Quantization: generate generic quantum problem (quadratic unconstrained binary optimization problem)
    # to run on quantum (simulator) backend
    quantum_problem = backend_runner.Problem(P, q, A, l, u, portfolio_model_df, RISK_WEIGHT, ESG_WEIGHT, resolution=1)
    solver_qiskit = backend_runner.Solver(provider_name='qiskit_ibm', algorithm='QAOA')
    job_qiskit = backend_runner.Job(quantum_problem, solver_qiskit)
    backend_runner.run_job(job_qiskit)

    solution_output_percent = dict(zip(job_qiskit.problem.dataframe.index, job_qiskit.result.variable_values.round(2)))
    print(f'Qiskit on LocalSimulator suggested portfolio composition[%]: {solution_output_percent}')
    print(f'Qiskit on LocalSimulator objective value: {job_qiskit.result.objective_value}')


if __name__ == '__main__':
    main()
