import numpy as np
import pypfopt as ppo

def calc_historic_rate_of_return_pa(price_time_series):
    return ppo.expected_returns.mean_historical_return(price_time_series).to_numpy()

def calc_historic_volatility_pa(price_time_series):
    return np.sqrt(np.diag(ppo.risk_models.sample_cov(price_time_series).to_numpy())) / price_time_series.mean()

def calc_historic_sharpe_ratio(historic_rate_of_return_pa,risk_free_return_pa, historic_volatility_pa): 
    return (historic_rate_of_return_pa - risk_free_return_pa) / historic_volatility_pa

def calc_expected_covariance_pa(price_time_series):
    return ppo.risk_models.risk_matrix(price_time_series, method="sample_cov")