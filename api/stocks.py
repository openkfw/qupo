import numpy as np
import pypfopt as ppo
import pandas as pd
from dataclasses import dataclass, InitVar
import finance_utilities as fu

@dataclass
class Stock:
    price_time_series: pd.Series   # stock price time series [€]
    ticker: str = "Ticker"
    full_name: str = "Stock Name"
    historic_esg_value: np.float32 = None
    risk_free_return_pa: InitVar[np.float32] = 0

    def __post_init__(self,risk_free_return_pa):
        self.historic_rate_of_return_pa = fu.calc_historic_rate_of_return_pa(self.price_time_series)  # annualized historic mean returns [%]
        self.historic_volatility_pa = fu.calc_historic_volatility_pa(self.price_time_series) # annualized historic volatility relative to hist. RoR pa[%]
        self.historic_sharpe_ratio = fu.calc_historic_sharpe_ratio(self.historic_rate_of_return_pa, risk_free_return_pa, self.historic_volatility_pa)
        