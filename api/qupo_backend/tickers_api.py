import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from pytickersymbols import PyTickerSymbols
from sqlalchemy.orm import Session

from .db.stocks import schemas
from .tickers_utilities import filter_stocks, get_all_symbols, get_data_of_symbol, replace_to_yahoo_symbols
from .db.database import get_db

router = APIRouter(
    prefix='/tickers',
    tags=['tickers'],
)

stock_data = PyTickerSymbols()


class Parameters(BaseModel):
    symbol: str
    start: str
    end: str


@router.get('/symbols')
async def get_symbols(symbols_only: bool = False):
    try:
        return get_all_symbols(stock_data, symbols_only)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail='Could not get any symbols.')


@router.get('/indices')
async def get_indices():
    try:
        return sorted(stock_data.get_all_indices())
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail='Could not fetch indices.')


@router.get('/indices/{index}')
async def get_symbols_of_index(index: str, symbols_only: bool = False):
    try:
        if (symbols_only):
            return sum(stock_data.get_yahoo_ticker_symbols_by_index(index), [])
        return replace_to_yahoo_symbols(list(stock_data.get_stocks_by_index(index)))
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail=f'Could not fetch symbols of index: {index}.')


@router.get('/countries')
async def get_countries():
    try:
        return stock_data.get_all_countries()
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail='Could not fetch countries.')


@router.get('/countries/{country}')
async def get_symbols_of_country(country: str, symbols_only: bool = False):
    try:
        stocks = list(stock_data.get_stocks_by_country(country))
        if (symbols_only):
            return sum(filter_stocks(stocks), [])
        return replace_to_yahoo_symbols(stocks)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail=f'Could not fetch symbols of country: {country}.')


@router.get('/industries')
async def get_industries():
    try:
        return stock_data.get_all_industries()
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail='Could not fetch industries.')


@router.get('/industries/{industry}')
async def get_symbols_of_industry(industry: str, symbols_only: bool = False):
    try:
        stocks = list(stock_data.get_stocks_by_industry(industry))
        if (symbols_only):
            return sum(filter_stocks(stocks), [])
        return replace_to_yahoo_symbols(stocks)
    except Exception as e:
        logging.exception(e)
        raise HTTPException(status_code=500, detail=f'Could not fetch symbols of industry: {industry}')


@router.post('/stock/', response_model=schemas.Stock)
async def stock(params: Parameters, db: Session = Depends(get_db)):
    try:
        return get_data_of_symbol(schemas.StockBase(symbol=params.symbol),
                                  params.start, params.end, db)
    except Exception as e:
        logging.exception(e)
        raise e
