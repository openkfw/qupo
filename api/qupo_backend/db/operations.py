import json
import yfinance

from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.orm import Session

from . import crud, schemas


def get_data_in_timeframe(db: Session, stock: schemas.StockBase):
    info = crud.get_info(db, stock)
    history = crud.get_history(db, stock)
    return schemas.Stock(id=0, symbol=stock.symbol, start=stock.start, end=stock.end,
                         info=[info], history=history)


def get_data_from_yahoo(symbol: str, period: str):
    data = yfinance.Ticker(symbol)
    yhistory = json.loads(data.history(period=period).to_json(orient='split'))
    return data, yhistory


def deconstruct_yhistory(yhistory):
    history = []
    for i in range(len(yhistory['index'])):
        date = datetime.date(datetime.fromtimestamp(yhistory['index'][i] / 1000.0))
        rowData = yhistory['data'][i]
        row = schemas.HistoryCreate(date=date, open=rowData[0], high=rowData[1],
                                    low=rowData[2], close=rowData[3], volume=rowData[4],
                                    dividends=rowData[5], splits=rowData[6])
        history.append(row)
    return history


def save_finance_data(db: Session, stock: schemas.StockBase):
    data, yhistory = get_data_from_yahoo(stock.symbol, 'max')

    if(yhistory['data']):
        history = deconstruct_yhistory(yhistory)
        info = schemas.InfoCreate(name=data.info['shortName'], type=data.info['quoteType'],
                                  country=data.info['country'], currency=data.info['currency'])

        crud.create_stock(db, stock)
        crud.create_stock_info(db, info, stock.symbol)
        crud.create_stock_history(db, history, stock.symbol)
        db.commit()

        return get_data_in_timeframe(db, stock)

    raise HTTPException(status_code=404, detail=f'No data found for symbol: {stock.symbol}')


def update_history(db: Session, stock: schemas.BaseModel, last_date):
    _, yhistory = get_data_from_yahoo(stock.symbol, 'max')

    if(yhistory['data']):
        history = []
        for i in range(len(yhistory['index'])):
            date = datetime.date(datetime.fromtimestamp(yhistory['index'][i] / 1000.0))
            if(date > last_date):
                rowData = yhistory['data'][i]
                row = schemas.HistoryCreate(date=date, open=rowData[0], high=rowData[1],
                                            low=rowData[2], close=rowData[3], volume=rowData[4],
                                            dividends=rowData[5], splits=rowData[6])
                history.append(row)

        crud.create_stock_history(db, history, stock.symbol)
        db.commit()
        return get_data_in_timeframe(db, stock)

    raise HTTPException(status_code=400, detail=f'Could not update history for symbol: {stock.symbol}')
