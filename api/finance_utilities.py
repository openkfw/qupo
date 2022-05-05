import numpy as np
import pypfopt as ppo
from scipy import sparse

def calc_historic_rate_of_return_pa(price_time_series):
    return ppo.expected_returns.mean_historical_return(price_time_series).to_numpy()

def calc_historic_volatility_pa(price_time_series):
    return np.sqrt(np.diag(ppo.risk_models.sample_cov(price_time_series).to_numpy())) / price_time_series.mean()

def calc_historic_sharpe_ratio(historic_rate_of_return_pa,risk_free_return_pa, historic_volatility_pa): 
    return (historic_rate_of_return_pa - risk_free_return_pa) / historic_volatility_pa

def calc_expected_covariance_pa(price_time_series):
    return ppo.risk_models.risk_matrix(price_time_series, method="sample_cov")

def convert_business_to_osqp_model(dataframe, risk_weight, esg_weight):
    # osqp (sparse matrix) notation for quadratic constrained problems:
    # objective: minimize 0.5*x^T*P*x + q*x
    # constraints: subject to l <= A*x <= u
    # with T the transpose operator
    def _make_obj_matrix(covar, n):
        obj_matrix = sparse.csc_matrix(covar)
        return obj_matrix

    def _make_obj_vector(alpha_vector, alpha_scaling, beta_vector, beta_scaling):
        obj_vector = alpha_scaling * alpha_vector + beta_scaling * beta_vector
        return obj_vector

    def _make_constraint_matrix(n):
        sum_one_matrix = _make_sum_one_constraint(n)
        asset_matrix = _make_asset_constraints(n)
        constraint_matrix = sparse.vstack([asset_matrix,
                                           sum_one_matrix], format="csc")
        return constraint_matrix

    def _make_sum_one_constraint(n):
        sum_one = sparse.csc_matrix(np.ones((1, n)))
        return sum_one

    def _make_asset_constraints(n):
        asset_matrix = sparse.eye(n)
        return asset_matrix

    def _make_lower_bounds(n, w_init):
        lb = np.hstack([np.zeros(n), 1])
        return lb

    def _make_upper_bounds(n, asset_ub, w_init):
        ub = np.hstack([asset_ub, 1])
        return ub

    n_portfolio = len(dataframe.index)
    w_init = np.ones(n_portfolio) * 1 / n_portfolio
    asset_ub = np.ones(n_portfolio)

    P = _make_obj_matrix(dataframe.iloc[:, -n_portfolio:].to_numpy(), n_portfolio)
    q = _make_obj_vector(dataframe.RateOfReturn.to_numpy(), 0.5*risk_weight,
                         dataframe.ESGRating.to_numpy(), 0.5*esg_weight)
    A = _make_constraint_matrix(n_portfolio)
    l = _make_lower_bounds(n_portfolio, w_init)
    u = _make_upper_bounds(n_portfolio, asset_ub, w_init)

    return P, q, A, l, u
