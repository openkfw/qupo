from xmlrpc.client import boolean
from fastapi import APIRouter
from stocksymbol import StockSymbol

from ..config import settings

router = APIRouter(
    prefix='/tickers',
    tags=['tickers'],
)

api_key_stock_symbol = settings.stock_symbol_api_key
stock_symbol = StockSymbol(api_key_stock_symbol)


@router.get('', tags=['tickers'])
async def get_all_tickers():
    return [{'name': 'ticker1'}, {'name': 'ticker2'}]


@router.get('/symbols/')
async def get_symbols(symbols_only: boolean = False):
    markets = stock_symbol.market_list
    symbols = []

    for market in markets:
        symbols.append(stock_symbol.get_symbol_list(market=market["market"], symbols_only=symbols_only))

    return symbols


@router.get('/markets')
async def get_markets():
    return stock_symbol.market_list


@router.get('/markets/{market}')
async def get_symbols_of_market(market):
    return stock_symbol.get_symbol_list(market=market)


@router.get('/indices')
async def get_indices():
    return stock_symbol.index_list


@router.get('/indices/{index}')
async def get_symbols_of_index(index):
    return stock_symbol.get_symbol_list(index=index)
