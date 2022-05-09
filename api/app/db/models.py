from sqlalchemy import Column, Date, Integer, LargeBinary, String 

from .database import Base

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String)
    start = Column(Date)
    end = Column(Date)
    data = Column(LargeBinary)

