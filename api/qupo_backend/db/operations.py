import json
import yfinance

from datetime import datetime
from sqlalchemy.orm import Session

from . import crud, schemas


def get_data_in_timeframe(db: Session, stock: schemas.StockBase):
    info = crud.get_info(db, stock)
    history = crud.get_history(db, stock)
    return schemas.Stock(id=0, symbol=stock.symbol, start=stock.start, end=stock.end,
                         info=[info], history=history)


def get_data_from_yahoo(symbol: str, period: str):
    data = yfinance.Ticker(symbol)
    yhistory = json.loads(data.history(period=period, auto_adjust=False).to_json(orient='split'))
    return data, yhistory


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


def save_finance_data(db: Session, stock: schemas.StockBase):
    data, yhistory = get_data_from_yahoo(stock.symbol, 'max')

    if(len(yhistory['data']) > 0):
        history = deconstruct_yhistory(yhistory)
        info = schemas.InfoCreate(name=data.info['shortName'], type=data.info['quoteType'],
                                  country=data.info['country'], currency=data.info['currency'])

        crud.create_stock(db, stock)
        crud.create_stock_info(db, info, stock.symbol)
        crud.create_stock_history(db, history, stock.symbol)
        db.commit()

        return get_data_in_timeframe(db, stock)

    return None


def update_history(db: Session, stock: schemas.BaseModel, last_date):
    _, yhistory = get_data_from_yahoo(stock.symbol, 'max')

    if(len(yhistory['data']) > 0):
        history = []
        for i in range(len(yhistory['index'])):
            date = datetime.date(datetime.fromtimestamp(yhistory['index'][i] / 1000.0))
            if(date > last_date):
                row = construct_history_row(date, yhistory['data'][i])
                history.append(row)

        crud.create_stock_history(db, history, stock.symbol)
        db.commit()
        return get_data_in_timeframe(db, stock)

    return None
