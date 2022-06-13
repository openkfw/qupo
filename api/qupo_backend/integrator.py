import os
import json
from dotenv import load_dotenv

import yfinance
from datetime import datetime
from sqlalchemy.orm import Session

from .db import crud, schemas
from .db.operations import save_finance_data, get_data_in_timeframe

load_dotenv()


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
    if(os.getenv('USE_DB')):
        db_stock = crud.get_stock(db, stock)

        if db_stock is None:
            return save_finance_data(db, stock)

        return get_data_in_timeframe(db, stock)

    else:
        data = yfinance.Ticker(stock.symbol)
        yhistory = json.loads(data.history(start=str(stock.start), end=str(stock.end)).to_json(orient='split'))

        if(yhistory['data']):
            history = []
            for i in range(len(yhistory['index'])):
                date = datetime.date(datetime.fromtimestamp(yhistory['index'][i] / 1000.0))
                rowData = yhistory['data'][i]
                row = schemas.History(id=i, symbol=stock.symbol, date=date, open=rowData[0], high=rowData[1],
                                      low=rowData[2], close=rowData[3], volume=rowData[4],
                                      dividends=rowData[5], splits=rowData[6])
                history.append(row)

            info = schemas.Info(id=0, symbol=stock.symbol, name=data.info['shortName'], type=data.info['quoteType'],
                                country=data.info['country'], currency=data.info['currency'])

            return schemas.Stock(id=0, symbol=stock.symbol, start=stock.start, end=stock.end, info=[info], history=history)

    raise Exception
