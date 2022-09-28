import json
import yfinance

from datetime import datetime
from sqlalchemy.orm import Session

from . import crud, schemas


def get_data_in_timeframe(db: Session, stock: schemas.StockBase, start, end):
    info = crud.get_info(db, stock)
    history = crud.get_history(db, stock, start, end)
    created_stock = crud.get_stock(db, stock)
    return schemas.Stock(id=created_stock.id, symbol=stock.symbol, timestamp=created_stock.timestamp,
                         info=[info], history=history)


def get_data_from_yahoo(symbol: str, period: str):
    data = yfinance.Ticker(symbol)
    yhistory = json.loads(data.history(period=period, auto_adjust=False).to_json(orient='split'))
    return data, yhistory


def get_sustainability(data):
    if (data.sustainability is not None):
        return data.sustainability.loc['totalEsg']['Value']
    return 0


def construct_history_row(date, rowData):
    cleanedRowData = [0 if value is None else value for value in rowData]

    return schemas.HistoryCreate(date=date, open=cleanedRowData[0], high=cleanedRowData[1],
                                 low=cleanedRowData[2], close=cleanedRowData[3], volume=cleanedRowData[4],
                                 dividends=cleanedRowData[5], splits=cleanedRowData[6])


def deconstruct_yhistory(yhistory):
    history = []
    for i in range(len(yhistory['index'])):
        date = datetime.date(datetime.fromtimestamp(yhistory['index'][i] / 1000.0))
        row = construct_history_row(date, yhistory['data'][i])
        history.append(row)
    return history


def save_finance_data(db: Session, stock: schemas.StockBase, start, end):
    data, yhistory = get_data_from_yahoo(stock.symbol, 'max')

    if (len(yhistory['data']) > 0):
        history = deconstruct_yhistory(yhistory)
        sustainability = get_sustainability(data)
        # for some of the stocks, not all values are returned, e.g. country is not returned for 04Q.F stock, that's why here are unknown values
        info = schemas.InfoCreate(name=data.info.get('shortName', 'unknown'),
                                  type=data.info.get('quoteType', 'unknown'),
                                  country=data.info.get('country', 'unknown'),
                                  currency=data.info.get('currency', 'unknown'), sustainability=sustainability)

        crud.create_stock(db, stock)
        crud.create_stock_info(db, info, stock.symbol)
        crud.create_stock_history(db, history, stock.symbol)
        db.commit()

        return get_data_in_timeframe(db, stock, start, end)

    return None


def update_history(db: Session, stock: schemas.StockBase, last_date, start, end):
    _, yhistory = get_data_from_yahoo(stock.symbol, 'max')

    if (len(yhistory['data']) > 0):
        history = []
        for i in range(len(yhistory['index'])):
            date = datetime.date(datetime.fromtimestamp(yhistory['index'][i] / 1000.0))
            if (date > last_date):
                row = construct_history_row(date, yhistory['data'][i])
                history.append(row)

        crud.create_stock_history(db, history, stock.symbol)
        db.commit()
        return get_data_in_timeframe(db, stock, start, end)

    return None
