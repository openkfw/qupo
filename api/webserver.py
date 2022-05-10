from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    'http://localhost',
    'http://localhost:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.get('/health')
async def health():
    return {'status': 'ok'}


@app.get('/credentials')
def get_credentials():
    return 200


@app.get('/experiment')
def get_named_experiment_result(risk_weight: float = 1, esg_weight: float = 1, job_name: str = 'osqp'):
    return {'riskWeight': risk_weight, 'esgWeight': esg_weight, 'jobName': job_name}


@app.get('/timeseries/{ticker_symbol}')
def get_time_series(ticker_symbol: str):
    return {'tickerSymbol': ticker_symbol}


@app.get('/available_tickers')
def get_available_tickers():
    return 200
