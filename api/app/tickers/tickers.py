from fastapi import APIRouter

router = APIRouter(
    prefix="/tickers",
    tags=["tickers"],
)


@router.get("", tags=["tickers"])
async def get_all_tickers():
    return [{"name": "ticker1"}, {"name": "ticker2"}]
