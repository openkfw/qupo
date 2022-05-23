from pydantic import BaseSettings


class Settings(BaseSettings):
    azure_tenant_id: str = ''
    azure_client_id: str = ''
    azure_client_secret: str = ''
    ibmq_client_secret: str = ''
    nasdaq_api_key: str = ''
    sqllite_db_url: str = 'sqlite:///./app/db/finance.db'

    class Config:
        env_file = '.env'


settings = Settings()
