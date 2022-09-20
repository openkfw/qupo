# native packages
from dataclasses import dataclass, InitVar

# 3rd party packages
import numpy as np
import pandas as pd

# custom packages
import qupo_backend.models.finance_utilities as finance_utilities


@dataclass
class Stock:
    price_time_series: pd.Series   # stock price time series [€]
    ticker: str = 'Ticker'
    full_name: str = 'Stock Name'
    historic_esg_value: float = 0.0
    risk_free_return_pa: InitVar[float] = 0.0

    def __post_init__(self, risk_free_return_pa):
        # annualized historic mean returns [%]
        self.historic_rate_of_return_pa = finance_utilities.calc_historic_rate_of_return_pa(self.price_time_series)
        # annualized historic volatility relative to hist. RoR pa[%]
        self.historic_volatility_pa = finance_utilities.calc_historic_volatility_pa(self.price_time_series)
        self.historic_sharpe_ratio = finance_utilities.calc_historic_sharpe_ratio(self.historic_rate_of_return_pa,
                                                                                  risk_free_return_pa, self.historic_volatility_pa)


@dataclass
class PortfolioModel():
    stocks: InitVar[list[Stock]]
    risk_free_return_pa: InitVar[float] = 0.0

    def __post_init__(self, stocks, risk_free_return_pa):
        stocks_full_names = []
        stocks_tickers = []
        stocks_esg_data = []
        stocks_expected_rate_of_return_pa = np.array([])
        stocks_time_series = pd.DataFrame()

        for stock in stocks:
            stocks_full_names = stocks_full_names + [stock.full_name]
            stocks_tickers = stocks_tickers + [stock.ticker]
            stock_time_series = stock.price_time_series.to_frame(name=stock.ticker)
            stocks_time_series = pd.concat([stocks_time_series, stock_time_series], axis=1)
            stocks_esg_data = stocks_esg_data + [stock.historic_esg_value]
            stocks_expected_rate_of_return_pa = np.concatenate(
                (stocks_expected_rate_of_return_pa, finance_utilities.calc_historic_rate_of_return_pa(stocks_time_series[stock.ticker])))

        self.stocks = stocks
        self.risk_free_return_pa = risk_free_return_pa
        self.stocks_full_names = stocks_full_names
        self.stocks_tickers = stocks_tickers
        self.price_time_series = stocks_time_series
        self.expected_rates_of_return_pa = stocks_expected_rate_of_return_pa
        self.expected_esg_ratings = stocks_esg_data
        self.expected_covariance_pa = finance_utilities.calc_expected_covariance_pa(self.price_time_series)
        self.expected_volatilities_pa = finance_utilities.calc_historic_volatility_pa(self.price_time_series)
        self.expected_sharpe_ratios = finance_utilities.calc_historic_sharpe_ratio(
            np.array(self.expected_rates_of_return_pa), risk_free_return_pa, np.array(self.expected_volatilities_pa))

    def get_evaluation(self, stock_weights=[]):
        if (len(stock_weights) == 0):
            weight = 100 / len(self.stocks_tickers)
            stock_weights = np.full(len(self.stocks_tickers), weight)
        relative_weights = [weight / 100 for weight in stock_weights]
        price_time_series_weightend = np.dot(relative_weights, np.array(
            [stock.price_time_series for stock in self.stocks]))  # sum of weighted stock price time series
        rate_of_return_pa = finance_utilities.calc_historic_rate_of_return_pa(price_time_series_weightend)
        volatility_pa = finance_utilities.calc_historic_volatility_pa(price_time_series_weightend)
        sharpe_ratio = finance_utilities.calc_historic_sharpe_ratio(rate_of_return_pa, self.risk_free_return_pa,
                                                                    volatility_pa)
        esg_value = np.dot(relative_weights, self.expected_esg_ratings)

        return rate_of_return_pa, sharpe_ratio, esg_value
