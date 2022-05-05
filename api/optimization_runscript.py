import opti_backend_runner as obr
import stockdataintegrator_runscript as sdi
import finance_utilities as fu

risk_weight = 1
esg_weight = 1
portfolio_model_df = sdi.portfolios_df_from_default_stock_data()

# create abstract representation of problem (to identify and leverage hidden structure)
P, q, A, l, u = fu.convert_business_to_osqp_model(portfolio_model_df, risk_weight=risk_weight, esg_weight=esg_weight)
problem = obr.Problem(P, q, A, l, u, portfolio_model_df, risk_weight, esg_weight)

# 0. Classical benchmark solution: instantiate, configure and run
solver_pypo = obr.Solver(provider_name="PyPortfolioOptimization", algorithm="pypo")
job_pypo = obr.Job(problem, solver_pypo)
obr.run_job(job_pypo)

solution_output_percent = dict(zip(job_pypo.problem.dataframe.index, job_pypo.result.variables_values.round(2)))
print(f"PyPO suggested portfolio composition[%]: {solution_output_percent}")
print(f"PyPO objective value: {job_pypo.result.objective_value}")