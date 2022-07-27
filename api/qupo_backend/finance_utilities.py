# 3rd party packages
import numpy as np
import pypfopt as ppo
from scipy import sparse


def calc_historic_rate_of_return_pa(price_time_series):
    return ppo.expected_returns.mean_historical_return(price_time_series).to_numpy()


def calc_historic_volatility_pa(price_time_series):
    return np.sqrt(np.diag(ppo.risk_models.sample_cov(price_time_series).to_numpy())) / price_time_series.mean()


def calc_historic_sharpe_ratio(historic_rate_of_return_pa, risk_free_return_pa, historic_volatility_pa):
    return (historic_rate_of_return_pa - risk_free_return_pa) / historic_volatility_pa


def calc_expected_covariance_pa(price_time_series):
    return ppo.risk_models.risk_matrix(price_time_series, method='sample_cov')


def convert_business_to_osqp_model(dataframe, risk_weight, esg_weight):
    # return exact mathematical model of single period sustainable portfolio model without transaction costs
    # osqp (sparse matrix) notation for quadratic constrained problems:
    # objective: minimize 0.5*x^T*P*x + q*x
    # constraints: subject to l <= A*x <= u
    # with x - real valued vector (of variables x_i), T - transpose operator, P - objective matrix, q - objective vector, l/u - constraint lower/upper bound vector, A - constraint matrix
    n_portfolio = len(dataframe.index)
    covariance = dataframe.iloc[:, -n_portfolio:].to_numpy()
    P = sparse.csc_matrix(covariance) * risk_weight 
    q = dataframe.RateOfReturn.to_numpy() + esg_weight * dataframe.ESGRating.to_numpy() / 2
    A = sparse.vstack([sparse.eye(n_portfolio), sparse.csc_matrix(np.ones((1, n_portfolio)))], format='csc')
    l = np.hstack([np.zeros(n_portfolio), 1])
    u = np.hstack([np.ones(n_portfolio), 1]) 

    return P, q, A, l, u
