from sqlalchemy.orm import Session
from sqlalchemy import and_
from sqlalchemy import delete


from . import models, schemas


def get_calculation(db: Session, calculation: schemas.CalculationBase):
    return db.query(models.Calculation). \
        join(models.Result, models.Calculation.id == models.Result.calculation_id). \
        where(models.Calculation.model == calculation.model). \
        first()


def get_result(db: Session, id: int):
    return db.query(models.Result). \
        where(models.Result.calculation_id == id). \
        first()


def create_calculation(db: Session, calculation: schemas.CalculationCreate):
    db_calculation = models.Calculation(model=calculation.model, symbols=calculation.symbols,
                                        risk_weight=calculation.risk_weight, esg_weight=calculation.esg_weight)
    db.add(db_calculation)
    return db_calculation


def create_result(db: Session, result: schemas.ResultCreate, id: int):
    db_result = models.Result(calculation_id=id, rate_of_return=result.rate_of_return, esg_rating=result.esg_rating,
                              volatility=result.volatility, objective_value=result.objective_value,
                              rate_of_return_value=result.rate_of_return_value, variance=result.variance, esg_value=result.esg_value)
    #db_result = models.Result(**result.dict())
    db.add(db_result)
    return db_result
