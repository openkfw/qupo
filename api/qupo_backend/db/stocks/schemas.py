from datetime import date, datetime
from typing import List
from pydantic import BaseModel


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
    name: str
    type: str
    country: str
    currency: str
    sustainability: float


class InfoCreate(InfoBase):
    pass


class Info(InfoBase):
    id: int
    symbol: str

    class Config:
        orm_mode = True


class StockBase(BaseModel):
    symbol: str


class StockCreate(StockBase):
    pass


class Stock(StockBase):
    id: int
    timestamp: datetime
    info: List[Info] = []
    history: List[History] = []

    class Config:
        orm_mode = True
