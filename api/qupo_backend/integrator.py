import json
import yfinance
from fastapi import HTTPException
from sqlalchemy.orm import Session

from .config import settings
from .db import crud, schemas
from .db.operations import (save_finance_data, get_data_in_timeframe,
                            update_history, deconstruct_yhistory)


def filter_stocks(stocks):
    ticker_list = []
    for stock in stocks:
        sub_list = []
        for symbol in stock['symbols']:
            if symbol['yahoo'] != '-':
                sub_list.append(symbol['yahoo'])
        ticker_list.append(sub_list)
    return ticker_list


def get_all_symbols(stock_data, symbols_only: bool):
    indices = stock_data.get_all_indices()
    symbols = []

    for index in indices:
        if(symbols_only):
            symbols.extend([*stock_data.get_yahoo_ticker_symbols_by_index(index)])
        else:
            symbols.append(list(stock_data.get_stocks_by_index(index)))

    return sum(symbols, [])


def get_data_of_symbol(stock: schemas.StockBase, db: Session):
    if(settings.use_db):
        db_stock = crud.get_stock(db, stock)

        if db_stock is None:
            return save_finance_data(db, stock)

        date_last_entry = db_stock.history[len(db_stock.history) - 1].date
        if(date_last_entry < stock.end):
            return update_history(db, stock, date_last_entry)

        return get_data_in_timeframe(db, stock)

    else:
        data = yfinance.Ticker(stock.symbol)
        yhistory = json.loads(data.history(start=str(stock.start), end=str(stock.end)).to_json(orient='split'))

        if(yhistory['data']):
            history = deconstruct_yhistory(yhistory)

            info = schemas.Info(id=0, symbol=stock.symbol, name=data.info['shortName'], type=data.info['quoteType'],
                                country=data.info['country'], currency=data.info['currency'])

            return schemas.Stock(id=0, symbol=stock.symbol, start=stock.start, end=stock.end, info=[info], history=history)

    raise HTTPException(status_code=500, detail=f'Unable to return stock data of symbol: {stock.symbol}.')
