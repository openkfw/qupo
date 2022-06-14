# qupo

Platform for portfolio optimization using quantum and not quantum

## Getting started

The application is composed of two parts which are required to be started separately. Before starting, please make sure you have at least Python 3.9 installed and your `python3` command points to the version 3.9 or higher.

### Backend

Navigate into the api folder: `cd api`.

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

   After startup the API URL can be accessed at: <http://127.0.0.1:8000/docs>

   It is possible also to run other scripts in the poetry environment:

   ```(bash)
   poetry run python qupo_backend/opti_backend_runscript.py
   ```
