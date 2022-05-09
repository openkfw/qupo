from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

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
def getStock(stockInfo: schemas.StockBase, db: Session = Depends(get_db)):
    stock = crud.get_stock(db, stockInfo)
    if stock is None:
        # Get data from yahoo
        data = "yahoo financial data"
        stockToCreate = schemas.StockCreate(symbol=stockInfo.symbol, start=stockInfo.start, end=stockInfo.end, data=data.encode())
        return crud.create_stock(db, stockToCreate)
    return stock
