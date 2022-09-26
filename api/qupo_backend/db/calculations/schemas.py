from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class ResultBase(BaseModel):
    rate_of_return: Dict[Any, Any] = None
    esg_rating: Dict[Any, Any] = None
    volatility: Dict[Any, Any] = None
    objective_value: float
    rate_of_return_value: float
    risk: float
    esg_value: float


class ResultCreate(ResultBase):
    pass


class Result(ResultBase):
    id: int
    calculation_id: int

    class Config:
        orm_mode = True


class CalculationBase(BaseModel):
    model: str
    symbols: List[str]
    # the symbol names are optional, as we fill them in the API
    symbol_names: Optional[List[str]] = None
    risk_weight: float
    esg_weight: float


class CalculationCreate(CalculationBase):
    pass


class Calculation(CalculationBase):
    id: int
    result: List[Result] = []

    class Config:
        orm_mode = True
