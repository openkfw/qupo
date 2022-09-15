# Qupo Backend

This folder contains all python files to calculate the portfolio with classical algorithms and with quantum algorithms.

### Start the backend

It contains a start script that allows you to locally start the app with:

```(bash)
./start_dev.sh
```

Or use the `Dockerfile` by first building and then running the container:

```bash
docker build -t qupo-backend .
docker run -p 8000:8000 qupo-backend
```
