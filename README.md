# QUPO

A platform for portfolio optimization using quantum and non quantum (classical) algorithms. The repository includes an `api` folder which contains the python backend that is responsible for the portfolio calculations. It is connected to a ReactJs frontend.

## Getting started

The application is composed of two parts which are required to be started separately. Before starting, please make sure you have at least Python 3.9 installed and your `python3` command points to the version 3.9 or higher:

### Install Python >3.9 and openblas

https://www.python.org/downloads/
openblas on MacOS (via homebrew):

```(bash)
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

```(bash)
   brew install python3
```

```(bash)
   brew install openblas
```

and follow the instructions to configure compilers

## Start locally

### Backend

Navigate into the api folder: `cd api`.

### Installation with Requirements.txt

1. Create a virtual env with the right python version and activate the environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   python --version  # Python 3.10.4
   ```

1. Install the requirements via the `requirements.txt` file:

   ```bash
   pip install -r requirements.txt
   ```

1. Set environment variables:

   ```(bash)
   cp .env_example .env
   ```

   This creates the `.env` file, containing all environment variables that have to be set.

1. Run the python backend with the run script:

   ```(bash)
   ./start_dev.sh
   ```

   The backend is now running at [http://localhost:8000](http://localhost:8000/health).

### Installation with Poetry

1. [Install and register Poetry Package Manager](https://python-poetry.org/docs/#installation):

   ```(bash)
   curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python
   ```

   Open a new terminal and register poetry

   ```(bash)
   source ~/.poetry/env
   ```

1. Install the requirements via poetry

   ```(bash)
   poetry install
   ```

1. Activate poetry shell

   ```(bash)
   poetry shell
   ```

1. Set environment variables

   ```(bash)
   cp .env_example .env
   ```

   This creates the `.env` file, containing all environment variables that have to be set.

1. Run the python API:

   ```(bash)
   ./start_dev.sh
   ```

   The backend is now running at [http://localhost:8000](http://localhost:8000/health).

   After startup the API URL can be accessed at: <http://127.0.0.1:8000/docs>

   It is possible also to run other scripts in the poetry environment:

   ```(bash)
   poetry run python qupo_backend/test/opti_backend_runscript.py
   ```

### Frontend

From your bash navigate into the frontend folder: `cd ../frontend`. It is a create-react-app and contains all the files that are needed to run the web application.

1. Set environment variables

   ```(bash)
   cp .env_example .env
   ```

   For local development set the `REACT_APP_API_URL` env variable to `http://localhost:8000`.

1. On initial start-up, first install all required packages from the `package.json` file. Then you can run the app with:

   ```bash
   npm install
   npm start
   ```

In your browser visit [http://localhost:3000](http://localhost:3000) to see the app up and running.

## Start app with docker files

The repository includes docker files for the api service as well as for the frontend. You can either start them individually (see respective READMEs) or use the `docker-compose.yml` file to start them together.

1. Make sure to navigate to the root folder, where the `docker-compose.yml` file is located.

1. Set environment variables:

   For the frontend:

   ```(bash)
   cp ./frontend/.env_example frontend.env
   ```

   For running the application within docker container set the `REACT_APP_API_URL` environment variable to `http://api:8000`.

   For the backend:

   ```(bash)
   cp ./api/.env_example api.env
   ```

   The environemt variables for the backend are the same as for the local deployment.

1. In your bash run the docker containers with:

   ```(bash)
   docker compose up
   ```

Now the application should be up and running. You can view it on your browser at [http://localhost:8001](http://localhost:8001).
