# 3rd party packages
import numpy as np
import pypfopt
from scipy import sparse


def calc_historic_rate_of_return_pa(price_time_series):
    return pypfopt.expected_returns.mean_historical_return(price_time_series).to_numpy()


def calc_historic_volatility_pa(price_time_series):
    return np.sqrt(np.diag(pypfopt.risk_models.sample_cov(price_time_series).to_numpy())) / price_time_series.mean()


def calc_historic_sharpe_ratio(historic_rate_of_return_pa, risk_free_return_pa, historic_volatility_pa):
    return (historic_rate_of_return_pa - risk_free_return_pa) / historic_volatility_pa


def calc_expected_covariance_pa(price_time_series):
    return pypfopt.risk_models.risk_matrix(price_time_series, method='sample_cov')


def convert_business_to_osqp_model(dataframe, risk_weight, esg_weight):
    # osqp (sparse matrix) notation for quadratic constrained problems:
    # objective: minimize 0.5*x^T*P*x + q*x
    # constraints: subject to l <= A*x <= u
    # with T the transpose operator
    # TODO: Rename variables and functions
    # TODO: Check if functions are needed

    def _make_obj_vector(alpha_vector, beta_vector, beta_scaling):
        return (-1) * (alpha_vector + beta_scaling * beta_vector / 2)

    def _make_constraint_matrix(n):
        sum_one_matrix = sparse.csc_matrix(np.ones((1, n)))
        asset_matrix = sparse.eye(n)
        return sparse.vstack([asset_matrix, sum_one_matrix], format='csc')

    def _make_lower_bounds(n):
        return np.hstack([np.zeros(n), 1])

    def _make_upper_bounds(asset_ub):
        return np.hstack([asset_ub, 1])

    portfolio_size = len(dataframe.index)
    asset_initial_upper_bound = np.ones(portfolio_size)

    # P is the object matrix which is a sparesly populated n * n matrix where n is the number
    # stocks in the portfolio multiplied by the risk weitght (the alpha scaling)
    P = sparse.csc_matrix(dataframe.iloc[:, -portfolio_size:].to_numpy()) * risk_weight
    q = _make_obj_vector(dataframe.RateOfReturn.to_numpy(),
                         dataframe.ESGRating.to_numpy(), esg_weight)
    A = _make_constraint_matrix(portfolio_size)
    l = _make_lower_bounds(portfolio_size)
    u = _make_upper_bounds(asset_initial_upper_bound)

    return P, q, A, l, u
