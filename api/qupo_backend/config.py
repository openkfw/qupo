from pydantic import BaseSettings


class Settings(BaseSettings):
    azure_tenant_id: str = ''
    azure_client_id: str = ''
    azure_client_secret: str = ''
    azure_resource_group: str = ''
    azure_location: str = ''
    azure_name: str = ''
    azure_subscription_id: str = ''
    ibmq_client_secret: str = ''
    nasdaq_api_key: str = ''
    sqllite_db_url: str = 'sqlite:///./qupo_backend/db/finance.db'
    use_db: bool = False

    class Config:
        env_file = '.env'


settings = Settings()
