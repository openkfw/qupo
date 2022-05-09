from sqlalchemy.orm import Session

from . import models, schemas

def get_stock(db: Session, stock: schemas.StockBase):
    return db.query(models.Stock).filter(models.Stock.symbol == stock.symbol).filter(models.Stock.start == stock.start).filter(models.Stock.end == stock.end).first()

def create_stock(db: Session, stock: schemas.StockCreate):
    db_stock = models.Stock(symbol=stock.symbol, start=stock.start, end=stock.end, data=stock.data)
    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)
    return db_stock