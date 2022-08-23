import logging

from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from . import tickers_api
from .db.database import get_db
from .db.calculations import crud, schemas
from .models.portfolio_model import calculate_model


app = FastAPI()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=['*'],
    allow_headers=['*'],
)

apiRouter = APIRouter(
    responses={404: {'description': 'Not found'}},
)

apiRouter.include_router(tickers_api.router)

app.include_router(apiRouter)


class Parameters(BaseModel):
    models: List[str]
    symbols: List[str]
    risk_weight: float
    esg_weight: float


@app.get('/')
async def root():
    return {'message': 'Hello from qupo'}


@app.get('/health')
async def health():
    return {'status': 'ok'}


@app.post('/models', response_model=List[schemas.Calculation])
async def calculate_models(params: Parameters, db: Session = Depends(get_db)):
    try:
        results = []
        index = 1
        for model in params.models:
            db_calculation = crud.get_calculation(db, schemas.CalculationBase(model=model, symbols=params.symbols,
                                                                              risk_weight=params.risk_weight, esg_weight=params.esg_weight))
            print(f'DB CALCULATION: {db_calculation}')
            if db_calculation is None:
                result = calculate_model(db, model=model, symbols=params.symbols,
                                         risk_weight=params.risk_weight, esg_weight=params.esg_weight)
                calculation = schemas.CalculationCreate(model=model, symbols=params.symbols,
                                                        risk_weight=params.risk_weight, esg_weight=params.esg_weight)
                response = crud.create_calculation(db, calculation)
                db.commit()
                calc = crud.get_calculation(db, schemas.CalculationBase(model=model, symbols=params.symbols,
                                                                        risk_weight=params.risk_weight, esg_weight=params.esg_weight))
                
                print(f'calc SAVED ID: {calc.id}')
                result = schemas.ResultCreate(rate_of_return=result['RateOfReturn'], esg_rating=result['ESGRating'],
                                              volatility=result['Volatility'], objective_value=result['objective_value'],
                                              rate_of_return_value=result['rate_of_return'], variance=result['variance'], esg_value=result['esg_value'])
                res = crud.create_result(db, result, calc.id)
                print(f'RESULT SAVED: {res}')
                db.commit()

                db_calc = crud.get_calculation(db, schemas.CalculationBase(model=model, symbols=params.symbols,
                                                                           risk_weight=params.risk_weight, esg_weight=params.esg_weight))
                results.append(db_calc)
                index = index + 1
            else:
                results.append(db_calculation)
        return results
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500, detail='Could not calculate portfolio.')
