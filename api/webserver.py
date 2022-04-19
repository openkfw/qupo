from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/credentials")
def get_credentials():
    # return read_credentials()
    return 200


@app.get("/experiment")
def get_named_experiment_result(risk_weight:float=1, esg_weight:float=1, job_name:str="osqp"):
    # return util.post_job_get_results(float(risk_weight), float(esg_weight), job_name)
    return 200


@app.get("/timeseries/{ticker_symbol}")
def get_time_series(ticker_symbol: str):
    # ticker, stock_values = util.get_time_series(ticker_symbol)
    # if ticker is None:
    #     return {"error": "No data found for ticker symbol: " + ticker_symbol}
    # return {'tickerSymbol': ticker, 'values': stock_values}
    return 200


@app.get("/available_tickers")
def get_available_tickers():
    # stock_items = util.get_available_stock_tickers()
    # return {"availableTickers": [{"ticker": i[0], "fullName": i[1]} for i in stock_items if i != "Account"]}
    return 200


