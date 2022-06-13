import os
from dotenv import load_dotenv

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from . import models

load_dotenv()
DATABASE_URL = os.getenv('SQLITE_URL')

engine = create_engine(DATABASE_URL, connect_args={'check_same_thread': False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    if(os.getenv('USE_DB')):
        models.Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()
    else:
        yield sessionmaker(bind=None)
