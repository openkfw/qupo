import sys
import os.path
import warnings
import json
import yfinance
from qupo_backend.models.finance_classes import Stock, Portfolio, PortfoliosModel
from qupo_backend.tickers_utilities import extract_quandl_data, stock_data_to_dataframe

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), os.path.pardir)))


def extract_stock_tickers(scope='DAX'):
    if scope == 'DAX':
        file = open('api/test/ticker_symbols_dax.json')
        stock_ticker_names = json.load(file)
        stocks_dict = {stock['symbol']: stock['longName'] for stock in stock_ticker_names}
        stocks_dict.pop('DAI.DE')
        stocks_dict.pop('SHL.DE')
        stocks_dict.pop('ENR.DE')
        return stocks_dict
    elif scope == 'DAX_mini':
        file = open('api/test/ticker_symbols_dax_mini.json')
        stock_ticker_names = json.load(file)
        stocks_dict = {stock['symbol']: stock['longName'] for stock in stock_ticker_names}
        return stocks_dict
    else:
        print(f'Scope {scope} not available')


def extract_yfinance_data(stock_ticker='ADS', start_time='2018-01-01', end_time='2018-02-28'):
    return yfinance.download(stock_ticker, start_time, end_time)


def portfolios_df_from_default_stock_data():
    # extract, transform data from external (or local) sources
    stocks_dict = extract_stock_tickers()
    esg_data = extract_quandl_data()

    # create stock and portfolio objects for frontend
    stocks = []

    for item in stocks_dict.items():
        time_series = extract_yfinance_data(item[0])
        try:
            matches = [item[1].startswith(company_name.upper()) for company_name in esg_data.company_name]
            print(f'Stock Name {item}, ESG Match: {matches}')
            if any(matches):
                esg_data_value = esg_data[matches].net_impact_ratio.values[0]
            else:
                warnings.warn(f'ESG Data not available for {item[1]}. Set to  0.')
                esg_data_value = 0
        except KeyError:
            warnings.warn(f'ESG Data not available for {item[1]}. Set to  0.')
            esg_data_value = 0

        stock = Stock(time_series['Close'], ticker=item[0], full_name=item[1], historic_esg_value=esg_data_value)
        print(stock)
        stocks = stocks + [stock]

    portfolio = Portfolio(stocks)
    print(portfolio)

    # setup mathematical model
    portfolios_model = PortfoliosModel(stocks)
    print(portfolios_model)

    portfolios_model_df = stock_data_to_dataframe(portfolios_model)
    print(portfolios_model_df)
    return portfolios_model_df
