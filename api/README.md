# qupo

Platform for portfolio optimization using quantum and not quantum

## Getting started

The application is composed of two parts which are required to be started separately. Before starting, please make sure you have at least Python 3.9 installed and your `python3` command points to the version 3.9 or higher. 

### Backend

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

1. Run the backend python backend script:

    ```(bash)
    poetry run python src/qupo-backend/opti_backend_runscript.py
    ```
