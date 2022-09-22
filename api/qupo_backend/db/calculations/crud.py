from sqlalchemy.orm import Session
from sqlalchemy.ext.mutable import MutableList

from . import models, schemas


def get_calculation(db: Session, calculation: schemas.CalculationBase):
    return db.query(models.Calculation, models.Result). \
        join(models.Result, models.Calculation.id == models.Result.calculation_id). \
        filter(models.Calculation.model == calculation.model). \
        filter(models.Calculation.risk_weight == calculation.risk_weight). \
        filter(models.Calculation.esg_weight == calculation.esg_weight). \
        filter(models.Calculation.symbols == MutableList(calculation.symbols)). \
        filter(models.Calculation.start == calculation.start). \
        filter(models.Calculation.end == calculation.end). \
        first()


def get_result(db: Session, id: int):
    return db.query(models.Result). \
        where(models.Result.calculation_id == id). \
        first()


def create_calculation(db: Session, calculation: schemas.CalculationCreate):
    db_calculation = models.Calculation(model=calculation.model, symbols=calculation.symbols, risk_weight=calculation.risk_weight,
                                        esg_weight=calculation.esg_weight, start=calculation.start, end=calculation.end)
    db.add(db_calculation)
    db.commit()
    db.refresh(db_calculation)

    return db_calculation


def create_result(db: Session, result: schemas.ResultCreate, id: int):
    db_result = models.Result(calculation_id=id, **result.dict())
    db.add(db_result)
    db.commit()

    return db_result
