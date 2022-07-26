import json
import pandas as pd

from qupo_backend.qupo_classes import Stock, PortfoliosModel
from qupo_backend.stockdata_integrator import StockDataExtractor, StockDataTransformer
from qupo_backend.tickers_utilities import get_data_of_symbol
import qupo_backend.db.schemas as schemas


def portfolios_df_from_default_stock_data(db, symbols, start='2018-01-01', end='2018-02-28'):
    stock_data_extractor = StockDataExtractor(start_time=start, end_time=end)
    esg_data = stock_data_extractor.extract_quandl_data()

    # create stock and portfolio objects for frontend
    stocks = []

    for symbol in symbols:
        stock_data = get_data_of_symbol(schemas.StockBase(symbol=symbol, start=start, end=end), db)
        if(stock_data):
            try:
                matches = [stock_data.info[0].name.startswith(company_name.upper()) for company_name in esg_data.company_name]
                if any(matches):
                    esg_data_value = esg_data[matches].net_impact_ratio.values[0]
                else:
                    esg_data_value = 0
            except KeyError:
                esg_data_value = 0

            close_values = [h.close for h in stock_data.history]
            stock = Stock(pd.Series(data=close_values), ticker=symbol, full_name=stock_data.info[0].name, historic_esg_value=esg_data_value)
            stocks = stocks + [stock]

    # setup mathematical model
    portfolios_model = PortfoliosModel(stocks)

    stock_data_transformer = StockDataTransformer()
    portfolios_model_df = stock_data_transformer.to_dataframe(portfolios_model)

    return portfolios_model_df


def get_models():
    f = open('qupo_backend/models/models.json')
    models = json.load(f)
    f.close()

    return models
