import numpy as np

import backend_runner
from stockdata_integrator_runscript import portfolios_df_from_default_stock_data
from finance_utilities import convert_business_to_osqp_model

risk_weight = 1
esg_weight = 1
portfolio_model_df = portfolios_df_from_default_stock_data()

# create abstract representation of problem (to identify and leverage hidden structure)
P, q, A, l, u = convert_business_to_osqp_model(portfolio_model_df, risk_weight=risk_weight, esg_weight=esg_weight)
problem = backend_runner.Problem(P, q, A, l, u, portfolio_model_df, risk_weight, esg_weight)

# 0. Classical benchmark solution: instantiate, configure and run
# 0.1 PyPortfolioOptimization (excl. sustainability measures)
solver_pypo = backend_runner.Solver(provider_name='PyPortfolioOptimization', algorithm='pypo')
job_pypo = backend_runner.Job(problem, solver_pypo)
backend_runner.run_job(job_pypo)

solution_output_percent = dict(zip(job_pypo.problem.dataframe.index, job_pypo.result.variables_values.round(2)))
print(f'PyPO suggested portfolio composition[%]: {solution_output_percent}')
print(f'PyPO objective value: {job_pypo.result.objective_value}')

# 0.2 University of Oxford OSQP Solver (incl. sustainability measures)
solver_p = backend_runner.Solver(provider_name='PyPortfolioOptimization', algorithm='pypo')
job_pypo = backend_runner.Job(problem, solver_pypo)
backend_runner.run_job(job_pypo)

solution_output_percent = dict(zip(job_pypo.problem.dataframe.index, job_pypo.result.variables_values.round(2)))
print(f'OSQP suggested portfolio composition[%]: {solution_output_percent}')
print(f'OSQP objective value: {job_pypo.result.objective_value}')

# 1. Quantization: generate generic quantum problem (quadratic unconstrained binary optimization problem),
# instantiate and run qio
for algorithm in ['PA']:  # ['SA', 'PT', 'PA', 'Tabu', 'QMC', 'SMC']:
    for resolution in np.array([1]) * 1E3:
        for timeout in [60]:  # 60, 10, 1]:
            quantum_problem = backend_runner.Problem(P, q, A, l, u, portfolio_model_df, risk_weight, esg_weight, resolution=resolution)
            solver_qio = backend_runner.Solver(provider_name='Azure', algorithm=algorithm, config={'timeout': timeout, 'hardware': 'FPGA'})
            job_qio = backend_runner.Job(quantum_problem, solver_qio)
            backend_runner.run_job(job_qio)
            solution_output_percent = dict(zip(job_pypo.problem.dataframe.index, job_pypo.result.variables_values.round(2)))
            print(f'Azure QIO suggested portfolio composition[%]: {solution_output_percent}')
            print(f'Azure QIO objective value: {job_pypo.result.objective_value}')

# 2. Quantization: generate generic quantum problem (quadratic unconstrained binary optimization problem)
# to run on quantum (simulator) backend
quantum_problem = backend_runner.Problem(P, q, A, l, u, portfolio_model_df, risk_weight, esg_weight, resolution=1)
solver_qiskit = backend_runner.Solver(provider_name='IBM', algorithm='QAOA')
job_qiskit = backend_runner.Job(quantum_problem, solver_qiskit)
backend_runner.run_job(job_qiskit)

solution_output_percent = dict(zip(job_qiskit.problem.dataframe.index, job_qiskit.result.variables_values.round(2)))
print(f'Qiskit on LocalSimulator suggested portfolio composition[%]: {solution_output_percent}')
print(f'Qiskit on LocalSimulator objective value: {job_qiskit.result.objective_value}')
