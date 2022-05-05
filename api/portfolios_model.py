from portfolios import Portfolio
import numpy as np
import pandas as pd
import pypfopt as ppo
from dataclasses import InitVar, dataclass
import finance_utilities as fu

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
