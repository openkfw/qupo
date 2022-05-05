import numpy as np
import pypfopt as ppo
from dataclasses import dataclass, InitVar
import finance_utilities as fu

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