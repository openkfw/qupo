import numpy as np
import sys
import os.path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))

import qupo_backend.optimization_backend.opti_backend_runner as obr
import stockdata_integrator_runscript as sdi
import qupo_backend.finance_utilities as fu


def main():
    RISK_WEIGHT = 0.0001
    ESG_WEIGHT = 0.0001
    portfolio_model_df = sdi.portfolios_df_from_default_stock_data()

    # create abstract representation of problem (to identify and leverage hidden structure)
    P, q, A, l, u = fu.convert_business_to_osqp_model(portfolio_model_df, risk_weight=RISK_WEIGHT, esg_weight=ESG_WEIGHT)
    problem = obr.Problem(P, q, A, l, u, portfolio_model_df, RISK_WEIGHT, ESG_WEIGHT)

    # 0. Classical benchmark solution: instantiate, configure and run
    # 0.1 PyPortfolioOptimization (excl. sustainability measures)
    solver_pypo = obr.Solver(provider_name='PyPortfolioOptimization', algorithm='pypo')
    job_pypo = obr.Job(problem, solver_pypo)
    obr.run_job(job_pypo)

    solution_output_percent = dict(zip(job_pypo.problem.dataframe.index, job_pypo.result.variables_values.round(2)))
    print(f'PyPO suggested portfolio composition[%]: {solution_output_percent}')
    print(f'PyPO objective value: {job_pypo.result.objective_value}')

    # 0.2 University of Oxford OSQP Solver (incl. sustainability measures)
    solver_osqp = obr.Solver(provider_name='University of Oxford', algorithm='osqp')
    job_osqp = obr.Job(problem, solver_osqp)
    obr.run_job(job_osqp)

    solution_output_percent = dict(zip(job_osqp.problem.dataframe.index, job_osqp.result.variables_values.round(2)))
    print(f'OSQP suggested portfolio composition[%]: {solution_output_percent}')
    print(f'OSQP objective value: {job_osqp.result.objective_value}')

    # 1. Quantization: generate generic quantum problem (quadratic unconstrained binary optimization problem),
    # instantiate and run qio
    #for algorithm in ['PA']:  # ['SA', 'PT', 'PA', 'Tabu', 'QMC', 'SMC']:
    #    for resolution in np.array([1]) * 1E3:
    #        for timeout in [60]:  # 60, 10, 1]:
    #            quantum_problem = obr.Problem(P, q, A, l, u, portfolio_model_df, RISK_WEIGHT, ESG_WEIGHT, resolution=resolution)
    #            solver_qio = obr.Solver(provider_name='Azure', algorithm=algorithm, config={'timeout': timeout, 'hardware': 'FPGA'})
    #            job_qio = obr.Job(quantum_problem, solver_qio)
    #            obr.run_job(job_qio)
    #            solution_output_percent = dict(zip(job_pypo.problem.dataframe.index, job_pypo.result.variables_values.round(2)))
    #            print(f'Azure QIO suggested portfolio composition[%]: {solution_output_percent}')
    #            print(f'Azure QIO objective value: {job_pypo.result.objective_value}')

    # 2. Quantization: generate generic quantum problem (quadratic unconstrained binary optimization problem)
    # to run on quantum (simulator) backend
    #quantum_problem = obr.Problem(P, q, A, l, u, portfolio_model_df, RISK_WEIGHT, ESG_WEIGHT, resolution=1)
    #solver_qiskit = obr.Solver(provider_name='IBM', algorithm='QAOA')
    #job_qiskit = obr.Job(quantum_problem, solver_qiskit)
    #obr.run_job(job_qiskit)

    #solution_output_percent = dict(zip(job_qiskit.problem.dataframe.index, job_qiskit.result.variables_values.round(2)))
    #print(f'Qiskit on LocalSimulator suggested portfolio composition[%]: {solution_output_percent}')
    #print(f'Qiskit on LocalSimulator objective value: {job_qiskit.result.objective_value}')


if __name__ == '__main__':
    main()
