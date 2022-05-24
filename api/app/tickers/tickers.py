from fastapi import APIRouter
from pytickersymbols import PyTickerSymbols


router = APIRouter(
    prefix='/tickers',
    tags=['tickers'],
)

stock_data = PyTickerSymbols()


@router.get('/symbols')
async def get_all_symbols(symbols_only=False):
    indices = stock_data.get_all_indices()
    symbols = []

    for index in indices:
        if(symbols_only):
            symbols.extend([*stock_data.get_yahoo_ticker_symbols_by_index(index)])
        else:
            symbols.append(list(stock_data.get_stocks_by_index(index)))

    return sum(symbols, [])


@router.get('/indices')
async def get_indices():
    return sorted(stock_data.get_all_indices())


@router.get('/indices/{index}')
async def get_symbols_of_index(index: str, symbols_only=False):
    if(symbols_only):
        return sum(stock_data.get_yahoo_ticker_symbols_by_index(index), [])
    return list(stock_data.get_stocks_by_index(index))


@router.get('/countries')
async def get_countries():
    return stock_data.get_all_countries()


@router.get('/countries/{country}')
async def get_symbols_of_country(country: str):
    return list(stock_data.get_stocks_by_country(country))


@router.get('/industries')
async def get_industries():
    return stock_data.get_all_industries()


@router.get('/industries/{industry}')
async def get_symbols_of_industry(industry: str):
    return list(stock_data.get_stocks_by_industry(industry))
