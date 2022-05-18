import numpy as np
import pypfopt
from scipy import sparse


def calculate_historic_rate_of_return_pa(price_time_series):
    return pypfopt.expected_returns.mean_historical_return(price_time_series).to_numpy()


def calculate_historic_volatility_pa(price_time_series):
    return np.sqrt(np.diag(pypfopt.risk_models.sample_cov(price_time_series).to_numpy())) / price_time_series.mean()


def calculate_historic_sharpe_ratio(historic_rate_of_return_pa, risk_free_return_pa, historic_volatility_pa):
    return (historic_rate_of_return_pa - risk_free_return_pa) / historic_volatility_pa


def calculate_expected_covariance_pa(price_time_series):
    return pypfopt.risk_models.risk_matrix(price_time_series, method='sample_cov')


# business = ?
# better name for dataframe?
# Needs explanation
def convert_business_to_osqp_model(dataframe, risk_weight, esg_weight):
    # osqp (sparse matrix) notation for quadratic constrained problems:
    # objective: minimize 0.5*x^T*P*x + q*x
    # constraints: subject to l <= A*x <= u
    # with T the transpose operator

    # Question:
    # and x, P, q, l, u?

    # n not needed??
    """
    def _make_obj_matrix(covar):
        return sparse.csc_matrix(covar)

    def _make_obj_vector(alpha_vector, alpha_scaling, beta_vector, beta_scaling):
        return alpha_scaling * alpha_vector + beta_scaling * beta_vector

    def _make_constraint_matrix(n):
        sum_one_matrix = _make_sum_one_constraint(n)
        asset_matrix = _make_asset_constraints(n)
        return sparse.vstack([asset_matrix, sum_one_matrix], format='csc')

    def _make_sum_one_constraint(n):
        return sparse.csc_matrix(np.ones((1, n)))

    def _make_asset_constraints(n):
        return sparse.eye(n)

    def _make_lower_bounds(n, w_init):
        return np.hstack([np.zeros(n), 1])

    def _make_upper_bounds(n, asset_ub, w_init):
        return np.hstack([asset_ub, 1])

    portfolio_size = len(dataframe.index)
    w_init = np.ones(portfolio_size) * 1 / portfolio_size
    asset_ub = np.ones(portfolio_size)

    # What are P,q,A,l,u?
    P = _make_obj_matrix(dataframe.iloc[:, -portfolio_size:].to_numpy())
    q = _make_obj_vector(dataframe.RateOfReturn.to_numpy(), 0.5 * risk_weight,
                         dataframe.ESGRating.to_numpy(), 0.5 * esg_weight)
    A = _make_constraint_matrix(portfolio_size)
    l = _make_lower_bounds(portfolio_size, w_init)
    u = _make_upper_bounds(portfolio_size, asset_ub, w_init)
    """

    portfolio_size = len(dataframe.index)
    # asset_ub = ??
    asset_ub = np.ones(portfolio_size)

    P = sparse.csc_matrix(dataframe.iloc[:, -portfolio_size:].to_numpy())
    # Why 0.5?
    q = dataframe.RateOfReturn.to_numpy() * 0.5 * risk_weight + dataframe.ESGRating.to_numpy() * 0.5 * esg_weight
    sum_one_matrix = sparse.csc_matrix(np.ones((1, portfolio_size)))
    asset_matrix = sparse.eye(portfolio_size)
    A = sparse.vstack([asset_matrix, sum_one_matrix], format='csc')
    l = np.hstack([np.zeros(portfolio_size), 1])
    u = np.hstack([asset_ub, 1])

    return P, q, A, l, u
