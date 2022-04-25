from portfolios_model import PortfoliosModel
from stocks import Stock
from portfolios import Portfolio
from stockdata_integrator import StockDataExtractor, StockDataTransformer



if __name__ == "__main__":
    # extract, transform data from external (or local) sources
    stock_data_extractor = StockDataExtractor(start_time="2018-01-01", end_time="2018-02-28")
    stocks_dict = stock_data_extractor.extract_stock_tickers()
    esg_data = stock_data_extractor.extract_quandl_data()

    # create stock and portfolio objects for frontend
    stocks = []
    stock_test = Stock()
    print(stock_test)
    for item in stocks_dict.items():
        time_series = stock_data_extractor.extract_yfinance_data(item[0])
        print(esg_data)
        esg_value = esg_data
        stock = Stock(key=item[0], full_name=item[1], esg_value=1, time_series=time_series['Close'])
        print(Stock)
        stocks = stocks + [stock]
    print(f"Stocks: {stocks}")
    # portfolio = Portfolio(stocks)
    # print(portfolio)

    # setup mathematical model
    portfolios_model = PortfoliosModel(stocks)
    print(f"Portfolios Model {portfolios_model}")
    stock_data_transformer = StockDataTransformer()
    portfolios_model_df = stock_data_transformer.to_dataframe(portfolios_model)
