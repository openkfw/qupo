import json
import pandas as pd
from types import SimpleNamespace

import yfinance
from fastapi import HTTPException
from sqlalchemy.orm import Session

from .config import settings
from .db.stocks import crud, schemas
from .db.stocks.operations import (save_finance_data, get_data_in_timeframe,
                                   update_history, deconstruct_yhistory, get_sustainability)
from .models.finance_classes import PortfolioModel


def filter_stocks(stocks):
    '''Result object from the API contains multiple stocks from different sources.
    This method returns only the symbols provided by yahoo finance'''

    ticker_list = []
    for stock in stocks:
        sub_list = []
        for symbol in stock['symbols']:
            if symbol['yahoo'] != '-':
                sub_list.append(symbol['yahoo'])
        ticker_list.append(sub_list)
    return ticker_list


def replace_to_yahoo_symbols(stocks):
    for index in range(len(stocks)):
        if (len(stocks[index]['symbols']) > 0):
            stocks[index]['symbol'] = stocks[index]['symbols'][0]['yahoo']

    # Delete all stocks that have no symbols
    return [stock for stock in stocks if stock['symbol'] is not None]


def get_all_symbols(stock_data, symbols_only: bool):
    indices = stock_data.get_all_indices()
    symbols = []

    for index in indices:
        if (symbols_only):
            symbols.extend([*stock_data.get_yahoo_ticker_symbols_by_index(index)])
        else:
            symbols.append([json.dumps(stock) for stock in stock_data.get_stocks_by_index(index)])

    symbols_list = sum(symbols, [])

    if (symbols_only):
        return list(set(symbols))

    return replace_to_yahoo_symbols([json.loads(stock) for stock in set(symbols_list)])


def get_data_of_symbol(stock: schemas.StockBase, db: Session):
    if (settings.use_db):
        db_stock = crud.get_stock(db, stock)

        if db_stock is None:
            return save_finance_data(db, stock)

        date_last_entry = db_stock.history[len(db_stock.history) - 1].date
        if (date_last_entry < stock.end):
            return update_history(db, stock, date_last_entry)

        return get_data_in_timeframe(db, stock)

    else:
        data = yfinance.Ticker(stock.symbol)
        yhistory = json.loads(data.history(start=str(stock.start), end=str(stock.end), auto_adjust=False).to_json(orient='split'))

        if (len(yhistory['data']) > 0):
            history = deconstruct_yhistory(yhistory)

            info = schemas.InfoCreate(symbol=stock.symbol, name=data.info['shortName'], type=data.info['quoteType'],
                                      country=data.info['country'], currency=data.info['currency'], sustainability=get_sustainability(data))

            return SimpleNamespace(**{'symbol': stock.symbol, 'start': stock.start,
                                      'end': stock.end, 'info': [info], 'history': history})

    # TODO: Replace by generic exception and move HTTPException to API
    raise HTTPException(status_code=500, detail=f'Unable to return stock data of symbol: {stock.symbol}.')


def stock_data_to_dataframe(portfolio_model: PortfolioModel):
    expected_rate_of_return_pa = pd.DataFrame(data=portfolio_model.expected_rates_of_return_pa,
                                              index=portfolio_model.stocks_tickers,
                                              columns=['RateOfReturn'])
    expected_esg_ratings = pd.DataFrame(data=portfolio_model.expected_esg_ratings,
                                        index=portfolio_model.stocks_tickers,
                                        columns=['ESGRating'])
    expected_covariance_pa = portfolio_model.expected_covariance_pa
    expected_volatility_pa = pd.DataFrame(portfolio_model.expected_volatilities_pa,
                                          index=portfolio_model.stocks_tickers,
                                          columns=['Volatility'])
    return pd.concat([expected_rate_of_return_pa, expected_volatility_pa,
                      expected_esg_ratings, expected_covariance_pa], axis=1)
