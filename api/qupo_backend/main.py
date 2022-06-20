from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware

# from .config import settings
from . import rest_adapter

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
    prefix='/api',
    responses={404: {'description': 'Not found'}},
)

apiRouter.include_router(rest_adapter.router)

app.include_router(apiRouter)


@app.get('/')
async def root():
    return {'message': 'Hello from qupo'}


@app.get('/health')
async def health():
    return {'status': 'ok'}
