import pandas as pd

from .finance_classes import Stock, PortfolioModel
from .finance_utilities import convert_business_to_osqp_model
from .optimization_backend.backend_runner import Providers, run_job
from .optimization_backend.optimization_classes import Problem, Job, Solver

import qupo_backend.db.schemas as schemas
from qupo_backend.tickers_utilities import get_data_of_symbol, stock_data_to_dataframe


def portfolio_df_from_stock_data(db, symbols, start='2018-01-01', end='2018-02-28'):
    # create stock and portfolio objects for frontend
    stocks = []

    for symbol in symbols:
        stock_data = get_data_of_symbol(schemas.StockBase(symbol=symbol, start=start, end=end), db)
        if (stock_data):
            close_values = [h.close for h in stock_data.history]
            stock = Stock(pd.Series(data=close_values), ticker=symbol, full_name=stock_data.info[0].name,
                          historic_esg_value=stock_data.info[0].sustainability)
            stocks = stocks + [stock]

    # setup mathematical model
    portfolio_model = PortfolioModel(stocks)
    portfolio_model_df = stock_data_to_dataframe(portfolio_model)

    return portfolio_model_df, portfolio_model


def calculate_model(db, model, symbols, risk_weight=0.0001, esg_weight=0.0001):
    portfolio_model_df, portfolio_model = portfolio_df_from_stock_data(db, symbols)
    # create abstract representation of problem (to identify and leverage hidden structure)
    P, q, A, l, u = convert_business_to_osqp_model(portfolio_model_df, risk_weight, esg_weight)

    config = {}
    algorithm = model
    resolution = None

    if (model == 'qio'):
        algorithm = 'PA'
        config = {'timeout': 1, 'hardware': 'FPGA'}
        resolution = 1
    if (model == 'qiskit' or model == 'ionq'):
        algorithm = 'QAOA'
        resolution = 1

    problem = Problem(P, q, A, l, u, portfolio_model_df, risk_weight, esg_weight, resolution)
    solver = Solver(provider_name=Providers[model].value, algorithm=algorithm, config=config)
    job = Job(problem, solver)
    run_job(job)

    solution_output_percent = dict(zip(list(job.problem.dataframe.index), job.result.variables_values.round(2)))
    portfolio_model_df['RateOfReturn'].update(pd.Series(solution_output_percent))
    data = portfolio_model_df.iloc[:, 0:3]

    return {
        **data,
        'stock_names': portfolio_model.stocks_full_names,
        'objective_value': job.result.objective_value,
        'rate_of_return': job.result.rate_of_return,
        'variance': job.result.variance,
        'esg_value': job.result.esg_value
    }
