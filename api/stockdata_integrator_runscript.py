from qupo_classes import Stock, Portfolio, PortfoliosModel
from stockdata_integrator import StockDataExtractor, StockDataTransformer

def portfolios_df_from_default_stock_data():
    # extract, transform data from external (or local) sources
    stock_data_extractor = StockDataExtractor(start_time="2018-01-01", end_time="2018-02-28")
    stocks_dict = stock_data_extractor.extract_stock_tickers()
    esg_data = stock_data_extractor.extract_quandl_data()

    # create stock and portfolio objects for frontend
    stocks = []

    for item in stocks_dict.items():
        time_series = stock_data_extractor.extract_yfinance_data(item[0])
        print(esg_data)
        esg_value = esg_data
        stock = Stock(time_series['Close'], ticker=item[0], full_name=item[1], historic_esg_value=1)
        print(stock)
        stocks = stocks + [stock]

    portfolio = Portfolio(stocks)
    print(portfolio)

    # setup mathematical model
    portfolios_model = PortfoliosModel(stocks)
    print(portfolios_model)

    stock_data_transformer = StockDataTransformer()
    portfolios_model_df = stock_data_transformer.to_dataframe(portfolios_model)
    print(portfolios_model_df)
    return portfolios_model_df
