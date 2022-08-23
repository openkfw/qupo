from sqlalchemy import PickleType, Column, Float, ForeignKey, Integer, JSON, String
from sqlalchemy.orm import relationship
from sqlalchemy.ext.mutable import MutableList

from qupo_backend.db.database import Base


class Calculation(Base):
    __tablename__ = 'calculations'

    id = Column(Integer, primary_key=True, index=True)
    model = Column(String)
    symbols = Column(MutableList.as_mutable(PickleType), default=[])
    risk_weight = Column(Float)
    esg_weight = Column(Float)

    results = relationship('Result', back_populates='calculations')


class Result(Base):
    __tablename__ = 'results'

    id = Column(Integer, primary_key=True, index=True)
    calculation_id = Column(Integer, ForeignKey('calculations.id'))
    rate_of_return = Column(JSON)
    esg_rating = Column(JSON)
    volatility = Column(JSON)
    objective_value = Column(Float)
    rate_of_return_value = Column(Float)
    variance = Column(Float)
    esg_value = Column(Float)

    calculations = relationship('Calculation', back_populates='results')
