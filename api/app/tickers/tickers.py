from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import yfinance as yf
import json

from ..db import crud, models, schemas
from ..db.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(
    prefix='/tickers',
    tags=['tickers'],
)

@router.get("/", tags=["tickers"])
async def get_all_tickers():
    return [{"name": "ticker1"}, {"name": "ticker2"}]

@router.post("/stock/", response_model=schemas.Stock)
def getStock(stock: schemas.StockBase, db: Session = Depends(get_db)):
    db_stock = crud.get_stock(db, stock)

    if db_stock is None:
        crud.create_stock(db, stock)

        # Get data from yahoo
        data = yf.Ticker(stock.symbol)
        yhistory = json.loads(data.history(period="5d").to_json(orient="split"))
        history = []

        for i in range(len(yhistory["index"])):
            date = datetime.date(datetime.fromtimestamp(yhistory["index"][i]/1000.0))
            rowData = yhistory["data"][i]
            row = schemas.HistoryCreate(date=date,
                                        open=rowData[0],
                                        high=rowData[1],
                                        low=rowData[2],
                                        close=rowData[3],
                                        volume=rowData[4],
                                        dividends=rowData[5],
                                        splits=rowData[6])
            history.append(row)

        crud.create_stock_history(db, history, stock.symbol)
        info = schemas.InfoCreate(name=data.info["shortName"], type=data.info["quoteType"], source=data.info["country"], currency=data.info["currency"])
        crud.create_stock_info(db, info, stock.symbol)

        return crud.get_stock(db, stock)

    return db_stock
