import qupo_backend.optimization_backend.opti_backend_runner as backend_runner
import qupo_backend.finance_utilities as finance_utilities
import pandas as pd

from .utils import portfolios_df_from_default_stock_data


def calculate_classical(db, model, symbols, risk_weight=0.0001, esg_weight=0.0001):
    portfolio_model_df = portfolios_df_from_default_stock_data(db, symbols)

    # create abstract representation of problem (to identify and leverage hidden structure)
    P, q, A, l, u = finance_utilities.convert_business_to_osqp_model(portfolio_model_df, risk_weight, esg_weight)
    problem = backend_runner.Problem(P, q, A, l, u, portfolio_model_df, risk_weight, esg_weight)

    # University of Oxford OSQP Solver (incl. sustainability measures)
    solver_osqp = backend_runner.Solver(provider_name='University of Oxford', algorithm=model)
    job_osqp = backend_runner.Job(problem, solver_osqp)
    backend_runner.run_job(job_osqp)

    solution_output_percent = dict(zip(list(job_osqp.problem.dataframe.index), job_osqp.result.variables_values.round(2)))
    print(f'OSQP suggested portfolio composition[%]: {solution_output_percent}')
    print(f'OSQP objective value: {job_osqp.result.objective_value}')

    portfolio_model_df['RateOfReturn'].update(pd.Series(solution_output_percent))

    return portfolio_model_df.iloc[:, 0:3]
