import sys
import os.path
import warnings
import json
import yfinance
import quandl
import numpy as np
from dataclasses import dataclass, InitVar
from qupo_backend.models.finance_classes import Stock, PortfolioModel
import qupo_backend.models.finance_utilities as finance_utilities
from qupo_backend.tickers_utilities import stock_data_to_dataframe
from qupo_backend.config import settings

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))


@dataclass
class Portfolio:
    stocks: InitVar[list[Stock]]
    stock_weights: InitVar[np.ndarray] = np.array([])
    risk_free_return_pa: InitVar[float] = 0

    def __post_init__(self, stocks, stock_weights, risk_free_return_pa):
        self.stock_tickers = [stock.ticker for stock in stocks] + ['Acct']
        self.stock_full_names = [stock.full_name for stock in stocks] + ['Bank Account']
        if stock_weights.size == 0:
            stock_weights = np.append(np.zeros(len(self.stock_tickers) - 1), 1)
        elif np.sum(stock_weights) > 1:
            stock_weights = stock_weights / np.sum(stock_weights)
            print(f'Sum of stock weights >1, normalized to {stock_weights}')
        self.price_time_series = np.dot(stock_weights, np.array(
            [stock.price_time_series for stock in stocks] + [stocks[0].price_time_series * 0]))  # sum of weighted stock price time series
        # annualized historic returns [%] and relative volatility (standart deviation of return) [%]
        # annualized historic mean returns [%]
        self.historic_rate_of_return_pa = finance_utilities.calc_historic_rate_of_return_pa(self.price_time_series)
        # annualized historic volatility relative to hist. RoR pa[%]
        self.historic_volatility_pa = finance_utilities.calc_historic_volatility_pa(self.price_time_series)
        self.historic_sharpe_ratio = finance_utilities.calc_historic_sharpe_ratio(self.historic_rate_of_return_pa,
                                                                                  risk_free_return_pa, self.historic_volatility_pa)
        # sum of weighted stock price time series
        self.historic_esg_value = np.dot(stock_weights, np.array(
            [stock.historic_esg_value for stock in stocks] + [0]))


def extract_quandl_data(api_key=None, identifier='UPR/EXT'):
    quandl.ApiConfig.api_key = settings.nasdaq_api_key
    return quandl.get_table(identifier, qopts={'columns': ['company_name', 'net_impact_ratio']})


def extract_stock_tickers(scope='DAX'):
    if scope == 'DAX':
        file = open('api/test/ticker_symbols_dax.json')
        stock_ticker_names = json.load(file)
        stocks_dict = {stock['symbol']: stock['longName'] for stock in stock_ticker_names}
        stocks_dict.pop('DAI.DE')
        stocks_dict.pop('SHL.DE')
        stocks_dict.pop('ENR.DE')
        return stocks_dict
    elif scope == 'DAX_mini':
        file = open('api/test/ticker_symbols_dax_mini.json')
        stock_ticker_names = json.load(file)
        stocks_dict = {stock['symbol']: stock['longName'] for stock in stock_ticker_names}
        return stocks_dict
    else:
        print(f'Scope {scope} not available')


def extract_yfinance_data(stock_ticker='ADS', start_time='2018-01-01', end_time='2018-02-28'):
    return yfinance.download(stock_ticker, start_time, end_time)


def portfolios_df_from_default_stock_data():
    # extract, transform data from external (or local) sources
    stocks_dict = extract_stock_tickers()
    esg_data = extract_quandl_data()

    # create stock and portfolio objects for frontend
    stocks = []

    for item in stocks_dict.items():
        time_series = extract_yfinance_data(item[0])
        try:
            matches = [item[1].startswith(company_name.upper()) for company_name in esg_data.company_name]
            print(f'Stock Name {item}, ESG Match: {matches}')
            if any(matches):
                esg_data_value = esg_data[matches].net_impact_ratio.values[0]
            else:
                warnings.warn(f'ESG Data not available for {item[1]}. Set to  0.')
                esg_data_value = 0
        except KeyError:
            warnings.warn(f'ESG Data not available for {item[1]}. Set to  0.')
            esg_data_value = 0

        stock = Stock(time_series['Close'], ticker=item[0], full_name=item[1], historic_esg_value=esg_data_value)
        print(stock)
        stocks = stocks + [stock]

    portfolio = Portfolio(stocks)
    print(portfolio)

    # setup mathematical model
    portfolios_model = PortfolioModel(stocks)
    print(portfolios_model)

    portfolios_model_df = stock_data_to_dataframe(portfolios_model)
    print(portfolios_model_df)
    return portfolios_model_df
