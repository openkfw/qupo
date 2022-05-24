from fastapi import FastAPI, APIRouter

# from .config import settings
from .tickers import tickers

app = FastAPI()


apiRouter = APIRouter(
    prefix='/api',
    responses={404: {'description': 'Not found'}},
)

apiRouter.include_router(tickers.router)

app.include_router(apiRouter)


@app.get('/')
async def root():
    return {'message': 'Hello from qupo'}


@app.get('/health')
async def health():
    return {'status': 'ok'}
