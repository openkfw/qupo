class Stock:
    def __init__(self, key, full_name, time_series=[]):
        self.ticker = key
        self.full_name = full_name
        self.time_series = time_series
        self.rate_of_return = 0
        self.variance = 0

    def __repr__(self):
        return f"Stock(ticker={self.ticker}, full_name={self.full_name}, time_series={self.time_series})"