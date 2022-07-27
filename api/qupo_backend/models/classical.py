import qupo_backend.optimization_backend.backend_runner as backend_runner
import qupo_backend.finance_utilities as finance_utilities
import pandas as pd

from .utils import portfolios_df_from_default_stock_data, get_models


def calculate_classical_model(db, model, symbols, risk_weight=0.0001, esg_weight=0.0001):
    portfolio_model_df = portfolios_df_from_default_stock_data(db, symbols)
    models = get_models()

    # create abstract representation of problem (to identify and leverage hidden structure)
    P, q, A, l, u = finance_utilities.convert_business_to_osqp_model(portfolio_model_df, risk_weight, esg_weight)
    problem = backend_runner.Problem(P, q, A, l, u, portfolio_model_df, risk_weight, esg_weight)

    solver = backend_runner.Solver(provider_name=models[model]['provider'], algorithm=model)
    job = backend_runner.Job(problem, solver)
    backend_runner.run_job(job)

    solution_output_percent = dict(zip(list(job.problem.dataframe.index), job.result.variables_values.round(2)))
    print(f'OSQP suggested portfolio composition[%]: {solution_output_percent}')
    print(f'OSQP objective value: {job.result.objective_value}')

    portfolio_model_df['RateOfReturn'].update(pd.Series(solution_output_percent))

    return portfolio_model_df.iloc[:, 0:3]
