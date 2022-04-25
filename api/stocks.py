import numpy as np
import pypfopt as ppo
import pandas as pd


class Stock:
    def __init__(self, key="Ticker", full_name="Stock Name", esg_value=None, time_series=pd.Series(dtype="float64"), risk_free_return_pa=0):
        self.ticker = key
        self.full_name = full_name
        self.price_time_series = time_series  # stock price time series [€]
        self.historic_rate_of_return_pa = ppo.expected_returns.mean_historical_return(self.price_time_series)  # annualized historic mean returns [%]
        self.historic_volatility_pa = np.sqrt(ppo.risk_models.sample_cov(self.price_time_series)) / self.price_time_series.mean()
        # annualized historic volatility relative to hist. RoR pa[%]
        self.historic_sharpe_ratio = (self.historic_rate_of_return_pa - risk_free_return_pa) / self.historic_volatility_pa
        self.historic_esg_value = esg_value

    def __repr__(self):
        return f"Stock(ticker={self.ticker}, full_name={self.full_name}, time_series={self.price_time_series})"