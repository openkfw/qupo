from locale import currency
from sqlalchemy.orm import Session
from typing import List

from . import models, schemas

def get_stock(db: Session, stock: schemas.StockBase):
    return db.query(models.Stock). \
            join(models.Info). \
            join(models.History). \
            filter(models.Stock.symbol == stock.symbol). \
            first()

def create_stock(db: Session, stock: schemas.StockCreate):
    db_stock = models.Stock(symbol=stock.symbol, 
                            start=stock.start, 
                            end=stock.end)
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock

def create_stock_info(db: Session, info: schemas.InfoCreate, symbol: str):
    db_info = models.Info(symbol=symbol, 
                            name=info.name,
                            type=info.type, 
                            source=info.source,
                            currency=info.currency)
    db.add(db_info)
    db.commit()
    db.refresh(db_info)
    return db_info

def create_stock_history(db: Session, history: List[schemas.HistoryCreate], symbol: str):
    db_history = []
    for h in history:
        db_history.append(models.History(**h.dict(), symbol=symbol)) 
    db.add_all(db_history)
    db.commit()
    db.expire_all()
    return db_history
