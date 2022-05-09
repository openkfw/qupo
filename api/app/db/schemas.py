from datetime import date
from pydantic import BaseModel

class StockBase(BaseModel):
    symbol: str
    start: date
    end: date

class StockCreate(StockBase):
    data: bytes

class Stock(StockBase):
    id: int
    data: bytes

    class Config:
        orm_mode = True