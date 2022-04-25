from portfolios import Portfolio
import numpy as np
import pandas as pd
import pypfopt as ppo


class PortfoliosModel(Portfolio):
    def __init__(self, stocks, stock_weights=None, risk_free_return_pa=0):
        super().__init__(stocks, stock_weights=stock_weights, risk_free_return_pa=risk_free_return_pa)
        stocks_full_names = ["Bank Account"]
        stocks_tickers = ["Acct"]
        stocks_esg_data = [0.0]
        stocks_expected_rate_of_return_pa = [0.0]
        stocks_time_series = stocks[0].price_time_series*0.0 + 1.0
        stocks_time_series = stocks_time_series.to_frame(name=stocks_tickers[0])

        for stock in stocks:
            stocks_full_names = stocks_full_names + [stock.full_name]
            stocks_tickers = stocks_tickers + [stock.ticker]
            stock_time_series = stock.price_time_series.to_frame(name=stock.ticker)
            stocks_time_series = pd.concat([stocks_time_series, stock_time_series], axis=1)
            stocks_esg_data = stocks_esg_data + [stock.historic_esg_value]
            stocks_expected_rate_of_return_pa = stocks_expected_rate_of_return_pa + [ppo.expected_returns.mean_historical_return(stock_time_series)[stock.ticker]]

        self.price_time_series = stocks_time_series
        self.expected_rates_of_return_pa = stocks_expected_rate_of_return_pa
        self.expected_esg_ratings = stocks_esg_data
        self.expected_covariance_pa = ppo.risk_models.risk_matrix(self.price_time_series, method="sample_cov")
        self.expected_volatilities_pa = np.sqrt(np.diag(self.expected_covariance_pa)) / np.array(self.price_time_series.mean())
        expected_sharpe_ratios = (np.array(self.expected_rates_of_return_pa[1:]) - risk_free_return_pa) / np.array(self.expected_volatilities_pa[1:])
        self.expected_sharpe_ratios = np.append(0, expected_sharpe_ratios)


    def __repr__(self):
        return f"Stocks={self.stock_full_names}, \
                 Rates of Return={self.expected_rates_of_return_pa}, \
                 Volatilities={self.expected_volatilities_pa}, \
                 Sharpe Ratios={self.expected_sharpe_ratios})"
