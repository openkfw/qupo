# Qupo Backend

This folder contains all python files to calculate the portfolio with classical algorithms and with quantum algorithms.

## Start the backend

It contains a start script that allows you to locally start the app with:

```(bash)
./start_dev.sh
```

Or use the `Dockerfile` by first building and then running the container:

```bash
docker build -t qupo-backend .
docker run -p 8000:8000 qupo-backend
```

## Environment variables

To run all algorithms located in the backend, environment variables have to be set in the `.env` file of the `/api` folder:

- `AZURE_SUBSCRIPTION_ID`: Subscription ID of an active azure tenant
- `AZURE_RESOURCE_GROUP`: The name of the resource group in Azure containing your quantum workspace
- `AZURE_LOCATION`: The location of your Azure qauntum workspace
- `AZURE_NAME`: The name of your Azure quantum workspace
- `AZURE_TENANT_ID`: Tenant ID for the sign-in via Azure AD, see [How to create a service principal portal](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal)
- `AZURE_CLIENT_ID`: ID for the Azure AD application that is used for signing in via Azure AD
- `AZURE_CLIENT_SECRET`: Secret for signing in via Azure AD

- `IBMQ_CLIENT_SECRET`: Provided API token by IBM Qiskit, via IBM Quantum <https://quantum-computing.ibm.com/>
