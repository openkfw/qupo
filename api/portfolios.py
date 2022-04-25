import numpy as np
import pypfopt as ppo


class Portfolio:
    def __init__(self, stocks, stock_weights=None, risk_free_return_pa=0):
        self.stock_tickers = [stock.ticker for stock in stocks] + ['Acct']
        self.stock_full_names = [stock.full_name for stock in stocks] + ['Bank Account']
        print(f"Stock Names: {self.stock_full_names}")
        if stock_weights is None:
            stock_weights = np.append(np.zeros(len(self.stock_tickers) - 1), 1)
        elif np.sum(stock_weights) > 1:
            stock_weights = stock_weights / np.sum(stock_weights)
            print(f"Sum of stock weights >1, normalized to {stock_weights}")
        self.stock_weights = stock_weights
        print(f"Stock weights: {self.stock_weights}")
        self.price_time_series = np.dot(self.stock_weights, np.array([stock.price_time_series for stock in stocks] + [stocks[0].price_time_series*0]))  # sum of weighted stock price time series
        # annualized historic returns [%] and relative volatility (standart deviation of return) [%]
        print(f"Time Series: {self.price_time_series}")
        self.historic_rate_of_return_pa = ppo.expected_returns.mean_historical_return(self.price_time_series)  # annualized historic mean returns [%]
        self.historic_volatility_pa = np.sqrt(ppo.risk_models.sample_cov(self.price_time_series)) / \
             self.price_time_series.mean()
        # annualized historic volatility relative to hist. RoR pa[%]
        self.historic_sharpe_ratio = (self.historic_rate_of_return_pa - risk_free_return_pa) / self.historic_volatility_pa
        self.historic_esg_value = np.dot(self.stock_weights, np.array([stock.historic_esg_value for stock in stocks] + [0]))  # sum of weighted stock price time series

        # self esg

    def __repr__(self):
        return f"Portfolio(Stocks={self.stocks}, Composition in % ={self.composition*100}, Time Series={self.time_series}, Rate of Return={self.rate_of_return}, Covariance={self.covariance})"
