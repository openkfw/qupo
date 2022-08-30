from sqlalchemy.orm import Session
from typing import List

from . import models, schemas


def get_stock(db: Session, stock: schemas.StockBase):
    return db.query(models.Stock). \
        where(models.Stock.symbol == stock.symbol). \
        first()


def get_info(db: Session, stock: schemas.StockBase):
    return db.query(models.Info). \
        where(models.Info.symbol == stock.symbol). \
        first()


def get_history(db: Session, stock: schemas.StockBase):
    return db.query(models.History). \
        where(models.History.symbol == stock.symbol). \
        filter(models.History.date.between(stock.start, stock.end)). \
        all()


def create_stock(db: Session, stock: schemas.StockCreate):
    db_stock = models.Stock(symbol=stock.symbol, start=stock.start,
                            end=stock.end)
    db.add(db_stock)
    return db_stock


def create_stock_info(db: Session, info: schemas.InfoCreate, symbol: str):
    db_info = models.Info(symbol=symbol, name=info.name, type=info.type, country=info.country,
                          currency=info.currency, sustainability=info.sustainability)
    db.add(db_info)
    return db_info


def create_stock_history(db: Session, history: List[schemas.HistoryCreate], symbol: str):
    db_history = [models.History(**h.dict(), symbol=symbol) for h in history]
    db.add_all(db_history)
    return db_history
