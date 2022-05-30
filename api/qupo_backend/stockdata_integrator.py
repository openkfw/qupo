# native packages
from datetime import datetime
import sys
import os.path
sys.path.append(
    os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))


# 3rd party packages
import pandas as pd
import quandl
import yfinance as yf
import json

# custom packages
from qupo_backend.config import settings
from qupo_backend.qupo_classes import Stock, PortfoliosModel


date_format = '%Y-%m-%d'


class StockDataExtractor:
    def __init__(self, start_time='2018-01-01', end_time='2018-02-28', scope='DAX', config_path=None):
        self.start_time = datetime.strptime(start_time, date_format).date()
        self.end_time = datetime.strptime(end_time, date_format).date()
        self.scope = scope
        if config_path is not None:
            self.config = config_path

    def extract_stock_tickers(self):
        if self.scope == 'DAX':
            file = open("qupo/api/test/ticker_symbols_dax.json")
            stock_ticker_names = json.load(file)
            stocks_dict = {stock["symbol"]: stock["longName"] for stock in stock_ticker_names}
            stocks_dict.pop("DAI.DE")
            stocks_dict.pop("SHL.DE")
            stocks_dict.pop("ENR.DE")
            return stocks_dict
        else:
            print(f'Scope {self.scope} not available')

    def extract_yfinance_data(self, stock_ticker='ADS'):
        return yf.download(stock_ticker, self.start_time, self.end_time)

    def extract_quandl_data(self, api_key=None, identifier='UPR/EXT'):
        if api_key is None:
            api_key = settings.nasdaq_api_key
        return quandl.get_table(identifier, api_key=api_key, paginate=True)


class StockDataTransformer:
    def esg_data_select(self, quandl_table, stock: Stock, esg_identifier='net_impact_ratio'):
        return quandl_table[quandl_table.company_name.isin([stock.full_name])][['date', esg_identifier]].set_index('date')

    def to_dataframe(self, portfolios_model: PortfoliosModel):
        expected_rate_of_return_pa = pd.DataFrame(data=portfolios_model.expected_rates_of_return_pa,
                                                  index=portfolios_model.stocks_tickers,
                                                  columns=['RateOfReturn'])
        expected_esg_ratings = pd.DataFrame(data=portfolios_model.expected_esg_ratings,
                                            index=portfolios_model.stocks_tickers,
                                            columns=['ESGRating'])
        expected_covariance_pa = portfolios_model.expected_covariance_pa
        expected_volatility_pa = pd.DataFrame(portfolios_model.expected_volatilities_pa,
                                              index=portfolios_model.stocks_tickers,
                                              columns=['Volatility'])
        return pd.concat([expected_rate_of_return_pa, expected_volatility_pa, expected_esg_ratings, expected_covariance_pa],
                         axis=1)
    pass


class StockDataLoader():
    def to_sqlite():
        pass

    def from_sqlite():
        pass

    def to_userformat():
        pass

    pass
