from sqlalchemy import Column, Date, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Stock(Base):
    __tablename__ = 'stocks'

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, unique=True)
    start = Column(Date)
    end = Column(Date)

    info = relationship('Info', back_populates='stock')
    history = relationship('History', back_populates='stock')


class Info(Base):
    __tablename__ = 'info'

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, ForeignKey('stocks.symbol'))
    name = Column(String)
    type = Column(String)
    country = Column(String)
    currency = Column(String)
    sustainability = Column(Float)

    stock = relationship('Stock', back_populates='info')


class History(Base):
    __tablename__ = 'history'

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, ForeignKey('stocks.symbol'))
    date = Column(Date)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(Float)
    dividends = Column(Float)
    splits = Column(Float)

    stock = relationship('Stock', back_populates='history')
