# Quantum Portfolio Optimization (QUPO)

This prototype addresses two questions:

- Quantum computers are often described as a more efficient way to solve complex problems. But are they really capable of doing so or is this still a dream of the future?

- Optimizing the composition of a stock portfolio according to parameters like turnover or risk is a non-linear problem and usually can only be solved by approximation methods ("Monte Carlo"). The reason is the combinatorial explosion of the many possibilities how the portfolio could be composed, so that a classical computer would have to calculate all possibilities for the optimal solution - the number of possibilities is so huge that this is not possible in a manageable time. This is comparable to calculating all possible chess positions with a computer opponent - strategies and approximate solutions are also used there. Quantum computers promise to evaluate the numerous possible solutions in a fraction of the time.

This raises the question whether the optimization of a stock portfolio with the help of a quantum computer could include further parameters, which are currently not included due to the explosion of possibilities.

**Proposed solution**

The prototype uses a portfolio of assets that can be chosen arbitrarily. In addition to the dimensions "turnover" and "risk" (variance), the dimension "sustainability" is added. For this, a sustainability score from the ESG database is added for each asset. Thus, there are significantly more options for the composition of an optimal portfolio. The solution includes the following aspects:

- How do quantum solvers from IBM (Qiskit), Microsoft (Azure Quantum) and IonQ perform compared to a classical solver using the PyPortfolio library?
- How can the result be appealing and interactive in a user interface that invites experimentation?
Can the prototype be extended as a platform that is made available as open source and can thus be used for co-creation?

A platform for portfolio optimization using quantum and non quantum (classical) algorithms. The repository includes an `api` folder which contains the python backend that is responsible for the portfolio calculations. It is connected to a ReactJs frontend.

## Getting started

The application is composed of two parts which are required to be started separately. Before starting, please make sure you have at least Python 3.9 installed and your `python3` command points to the version 3.9 or higher:

### Install from scratch on an empty Ubuntu OS

First we clone the repository and get the API/backend running using python. Afterwards, we take care about the frontend. Make sure that the server is accessible and port 8000 open in the firewall.

```(bash)
git clone https://github.com/openkfw/qupo.git
````

Change to the api folder first, we do frontend later
```(bash)
cd qupo/api
````

Copy the example env file and edit the respective keys if you have them:

```(bash)
cp .env_example .env
````


Make sure the python 10 repository is available:
```(bash)
sudo add-apt-repository ppa:deadsnakes/ppa
```

Update the repo and upgrad if needed

```(bash)
sudo apt update && sudo apt upgrade
```

Install python version 10

```(bash)
sudo apt install software-properties-common -y
```

```(bash)
sudo apt install python3.10
```

Python should be installed now, which you can check with the version flag
```(bash)
python3.10 --version
````

Now install the pip package manager
```(bash)
sudo apt install python3-pip
````

To use a virtual environment (important for python, which is a mess without virtual environments), use this command

```(bash)
sudo pip3 install virtualenv 
````

Create a virtual environment with the respective python version
```(bash)
virtualenv --python="/usr/bin/python3.10" "./venv"
````

Activate the environment
```(bash)
source venv/bin/activate
````

Now install all required packages
```(bash)
pip install -r requirements.txt
```

Using uvicorn, the API should be able to start now

```(bash)
uvicorn qupo_backend.main:app --host 0.0.0.0 --port 8000 --reload
```

The API should be available now, which you can test with

```(bash)
wget <server>:8000/health
```

### Install Python >3.9 and openblas using MacOS

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
