import os
from dotenv import load_dotenv

def read_credentials(key=None):
    load_dotenv()
    if key == None:
        return {"NASDAQ_API_KEY": os.environ.get("NASDAQ_API_KEY"),
                "IBMQ_CLIENT_SECRET": os.environ.get("IBMQ_CLIENT_SECRET"),
                "AZURE_SUBSCRIPTION_ID": os.environ.get("AZURE_SUBSCRIPTION_ID"),
                "AZURE_RESOURCE_GROUP": os.environ.get("AZURE_RESOURCE_GROUP"),
                "AZURE_LOCATION": os.environ.get("AZURE_LOCATION"),
                "AZURE_NAME": os.environ.get("AZURE_NAME"),
                "AZURE_TENANT_ID": os.environ.get("AZURE_TENANT_ID"),
                "AZURE_CLIENT_ID": os.environ.get("AZURE_CLIENT_ID"),
                "AZURE_CLIENT_SECRET": os.environ.get("AZURE_CLIENT_SECRET")
                }
    else:
        return {key: os.environ.get(key)}