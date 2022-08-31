import logging

from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from . import tickers_api
from .db.database import get_db
from .db.calculations import schemas
from .models.portfolio_model import get_model_calculations


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


class Calculation(BaseModel):
    Calculation: schemas.Calculation
    Result: schemas.Result


@app.get('/')
async def root():
    return {'message': 'Hello from qupo'}


@app.get('/health')
async def health():
    return {'status': 'ok'}


@app.post('/models', response_model=List[Calculation])
async def calculate_models(params: Parameters, db: Session = Depends(get_db)):
    try:
        return get_model_calculations(db, params.models, {'symbols': params.symbols,
                                                          'risk_weight': params.risk_weight,
                                                          'esg_weight': params.esg_weight})
    except Exception as e:
        logging.error(e)
        raise HTTPException(status_code=500, detail='Could not calculate portfolio.')
