# native packages
from dataclasses import dataclass, InitVar

# 3rd party packages
import numpy as np
import pandas as pd

# custom packages
import finance_utilities as fu


@dataclass
class Stock:
    price_time_series: pd.Series   # stock price time series [€]
    ticker: str = "Ticker"
    full_name: str = "Stock Name"
    historic_esg_value: np.float32 = None
    risk_free_return_pa: InitVar[np.float32] = 0

    def __post_init__(self,risk_free_return_pa):
        self.historic_rate_of_return_pa = fu.calc_historic_rate_of_return_pa(self.price_time_series)  # annualized historic mean returns [%]
        self.historic_volatility_pa = fu.calc_historic_volatility_pa(self.price_time_series) # annualized historic volatility relative to hist. RoR pa[%]
        self.historic_sharpe_ratio = fu.calc_historic_sharpe_ratio(self.historic_rate_of_return_pa, risk_free_return_pa, self.historic_volatility_pa)
        

@dataclass
class Portfolio:
    stocks: InitVar
    stock_weights: InitVar[np.array] = None
    risk_free_return_pa: InitVar[np.float32] = 0

    def __post_init__(self, stocks, stock_weights, risk_free_return_pa):
        self.stock_tickers = [stock.ticker for stock in stocks] + ['Acct']
        self.stock_full_names = [stock.full_name for stock in stocks] + ['Bank Account']
        if stock_weights is None:
            stock_weights = np.append(np.zeros(len(self.stock_tickers) - 1), 1)
        elif np.sum(stock_weights) > 1:
            stock_weights = stock_weights / np.sum(stock_weights)
            print(f"Sum of stock weights >1, normalized to {stock_weights}")
        self.stock_weights = stock_weights
        self.price_time_series = np.dot(self.stock_weights, np.array([stock.price_time_series for stock in stocks] + [stocks[0].price_time_series*0]))  # sum of weighted stock price time series
        # annualized historic returns [%] and relative volatility (standart deviation of return) [%]
        self.historic_rate_of_return_pa = fu.calc_historic_rate_of_return_pa(self.price_time_series)  # annualized historic mean returns [%]
        self.historic_volatility_pa = fu.calc_historic_volatility_pa(self.price_time_series)  # annualized historic volatility relative to hist. RoR pa[%]
        self.historic_sharpe_ratio = fu.calc_historic_sharpe_ratio(self.historic_rate_of_return_pa, risk_free_return_pa, self.historic_volatility_pa)
        self.historic_esg_value = np.dot(self.stock_weights, np.array([stock.historic_esg_value for stock in stocks] + [0]))  # sum of weighted stock price time series


@dataclass
class PortfoliosModel():
    stocks: InitVar
    risk_free_return_pa: InitVar = 0

    def __post_init__(self, stocks, risk_free_return_pa):
        stocks_full_names = ["Bank Account"]
        stocks_tickers = ["Acct"]
        stocks_esg_data = [0.0]
        stocks_expected_rate_of_return_pa = np.array([0.0])
        stocks_time_series = stocks[0].price_time_series*0.0 + 1.0
        stocks_time_series = stocks_time_series.to_frame(name=stocks_tickers[0])

        for stock in stocks:
            stocks_full_names = stocks_full_names + [stock.full_name]
            stocks_tickers = stocks_tickers + [stock.ticker]
            stock_time_series = stock.price_time_series.to_frame(name=stock.ticker)
            stocks_time_series = pd.concat([stocks_time_series, stock_time_series], axis=1)
            stocks_esg_data = stocks_esg_data + [stock.historic_esg_value]
            stocks_expected_rate_of_return_pa = np.concatenate((stocks_expected_rate_of_return_pa,fu.calc_historic_rate_of_return_pa(stocks_time_series[stock.ticker])))
            print(f"RoR Stocks: {stocks_expected_rate_of_return_pa}")

        self.stocks_full_names = stocks_full_names
        self.stocks_tickers = stocks_tickers
        self.price_time_series = stocks_time_series
        self.expected_rates_of_return_pa = stocks_expected_rate_of_return_pa
        self.expected_esg_ratings = stocks_esg_data
        self.expected_covariance_pa = fu.calc_expected_covariance_pa(self.price_time_series)
        self.expected_volatilities_pa = fu.calc_historic_volatility_pa(self.price_time_series)
        expected_sharpe_ratios = fu.calc_historic_sharpe_ratio(np.array(self.expected_rates_of_return_pa[1:]),risk_free_return_pa,np.array(self.expected_volatilities_pa[1:]))
        self.expected_sharpe_ratios = np.append(0, expected_sharpe_ratios)
