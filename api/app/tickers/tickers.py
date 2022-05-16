from fastapi import APIRouter
from stocksymbol import StockSymbol

router = APIRouter(
    prefix='/tickers',
    tags=['tickers'],
)

api_key_stock_symbol = ""
stock_symbol = StockSymbol(api_key_stock_symbol)

@router.get('', tags=['tickers'])
async def get_all_tickers():
    return [{'name': 'ticker1'}, {'name': 'ticker2'}]

@router.get("/markets")
async def getMarkets():
    return stock_symbol.market_list

@router.get("/symbols")
@router.get("/symbols/{symbols_only}")
async def getSymbols(symbols_only = False):
    markets = stock_symbol.market_list
    symbols = []

    for market in markets:
        symbols.append(stock_symbol.get_symbol_list(market=market["market"], symbols_only=symbols_only))

    return symbols

@router.get("/symbols/{market}")
async def getSymbols(market):
    return stock_symbol.get_symbol_list(market=market)