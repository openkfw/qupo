# qupo

Platform for portfolio optimization using quantum and not quantum

## Getting started

The application is composed of two parts which are required to be started separately. Before starting, please make sure you have at least Python 3.9 installed and your `python3` command points to the version 3.9 or higher. 

### Backend

1. Create, and activate virtual environment:

    ```(bash)
    cd api
    python3 -m venv ./venv
    source ./venv/bin/activate
    ```

2. Install the requirements for development (they include the same linter that is used in the pipeline)

    ```(bash)
    pip install -r requirements_dev.txt
    ```

3. Start the backend application:

    ```(bash)
    ./start_dev.sh
    ```

To verify that the backend is running, the following URL can be used: <http://localhost:8000/health>
