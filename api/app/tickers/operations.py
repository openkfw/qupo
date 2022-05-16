from datetime import datetime
from sqlalchemy.orm import Session
import json
import yfinance

from ..db import crud, schemas


def save_finance_data(db: Session, stock: schemas.StockBase):
    # Get data from yahoo
    data = yfinance.Ticker(stock.symbol)
    yhistory = json.loads(data.history(period="max").to_json(orient="split"))
    history = []

    if(yhistory["data"]):
        crud.create_stock(db, stock)

        for i in range(len(yhistory["index"])):
            date = datetime.date(datetime.fromtimestamp(yhistory["index"][i] / 1000.0))
            rowData = yhistory["data"][i]
            row = schemas.HistoryCreate(date=date, open=rowData[0], high=rowData[1],
                                        low=rowData[2], close=rowData[3], volume=rowData[4],
                                        dividends=rowData[5], splits=rowData[6])
            history.append(row)

        crud.create_stock_history(db, history, stock.symbol)
        info = schemas.InfoCreate(name=data.info["shortName"], type=data.info["quoteType"],
                                  country=data.info["country"], currency=data.info["currency"])
        crud.create_stock_info(db, info, stock.symbol)

    return crud.get_stock(db, stock)
