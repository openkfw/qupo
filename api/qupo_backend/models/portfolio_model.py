import pandas as pd

from .optimization_backend.optimization_classes import Problem, Job, Solver
import qupo_backend.models.finance_utilities as finance_utilities
from .finance_classes import Stock, PortfoliosModel

from .optimization_backend.backend_runner import run_job
from qupo_backend.tickers_utilities import get_data_of_symbol
from qupo_backend.tickers_utilities import extract_quandl_data, stock_data_to_dataframe
import qupo_backend.db.schemas as schemas
from .optimization_backend.backend_runner import Providers


def portfolios_df_from_default_stock_data(db, symbols, start='2018-01-01', end='2018-02-28'):
    esg_data = extract_quandl_data()

    # create stock and portfolio objects for frontend
    stocks = []

    for symbol in symbols:
        stock_data = get_data_of_symbol(schemas.StockBase(symbol=symbol, start=start, end=end), db)
        if (stock_data):
            try:
                matches = [stock_data.info[0].name.startswith(company_name.upper()) for company_name in esg_data.company_name]
                if any(matches):
                    esg_data_value = esg_data[matches].net_impact_ratio.values[0]
                else:
                    esg_data_value = 0
            except KeyError:
                esg_data_value = 0

            close_values = [h.close for h in stock_data.history]
            stock = Stock(pd.Series(data=close_values), ticker=symbol, full_name=stock_data.info[0].name, historic_esg_value=esg_data_value)
            stocks = stocks + [stock]

    # setup mathematical model
    portfolios_model = PortfoliosModel(stocks)
    portfolios_model_df = stock_data_to_dataframe(portfolios_model)

    return portfolios_model_df


def calculate_model(db, model, symbols, risk_weight=0.0001, esg_weight=0.0001):
    portfolio_model_df = portfolios_df_from_default_stock_data(db, symbols)
    # create abstract representation of problem (to identify and leverage hidden structure)
    P, q, A, l, u = finance_utilities.convert_business_to_osqp_model(portfolio_model_df, risk_weight, esg_weight)

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
    print(f'{model} suggested portfolio composition[%]: {solution_output_percent}')
    print(f'{model} objective value: {job.result.objective_value}')

    portfolio_model_df['RateOfReturn'].update(pd.Series(solution_output_percent))

    return portfolio_model_df.iloc[:, 0:3]
