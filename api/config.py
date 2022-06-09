import tomli


def settings():
    with open('config.toml', 'rb') as f:
        return tomli.load(f)
