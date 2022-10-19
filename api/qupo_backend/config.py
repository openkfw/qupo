from pydantic import BaseSettings


class Settings(BaseSettings):
    use_db: bool = True
    sqllite_db_url: str = 'sqlite:///./qupo_backend/db/finance.db'


settings = Settings()
