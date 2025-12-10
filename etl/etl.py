import os
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine

# Load .env from PROJECT ROOT
BASE_URL = Path(__file__).resolve().parent.parent
load_dotenv(BASE_URL/".env")

DATABASE_URL = os.getenv("DATABASE_URL")
print(f"Database URL: {os.getenv('DATABASE_URL')}")
print(f"Database URL on 2: {DATABASE_URL}")
engine = create_engine(DATABASE_URL)

# load Data
df=pd.read_csv("../data-lake/raw/Comprehensive_Banking_Database.csv")
df.to_sql("warehouse", con=engine, if_exists="append", index=False)
print("ETL COMPLETED SUCCESSFULLY")
