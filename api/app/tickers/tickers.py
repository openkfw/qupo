from sqlalchemy.orm import Session
import fastapi

from ..db import crud, models, schemas
from ..db.database import SessionLocal, engine
from .operations import save_finance_data


def get_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


router = fastapi.APIRouter(
    prefix='/tickers',
    tags=['tickers'],
)


@router.get("/", tags=["tickers"])
async def get_all_tickers():
    return [{"name": "ticker1"}, {"name": "ticker2"}]


@router.post("/stock/", response_model=schemas.Stock)
def getStock(stock: schemas.StockBase, db: Session = fastapi.Depends(get_db)):
    db_stock = crud.get_stock(db, stock)

    if db_stock is None:
        return save_finance_data(db, stock)

    return db_stock
