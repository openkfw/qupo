from datetime import date
from pydantic import BaseModel
from typing import List, Optional

class HistoryBase(BaseModel):
    date: date
    open: float
    high: float
    low: float
    close: float
    volume: float
    dividends: float
    splits: float

class HistoryCreate(HistoryBase):
    pass

class History(HistoryBase):
    id: int
    symbol: str

    class Config:
        orm_mode = True

class InfoBase(BaseModel):
    name: Optional[str]
    type: Optional[str]
    source: Optional[str]
    currency: Optional[str]

class InfoCreate(InfoBase):
    pass

class Info(InfoBase):
    id: Optional[int]
    symbol: Optional[str]

    class Config:
        orm_mode = True

class StockBase(BaseModel):
    symbol: str
    start: date
    end: date

class StockCreate(StockBase):
    pass

class Stock(StockBase):
    id: int
    info: Info = None
    history: List[History] = []

    class Config:
        orm_mode = True