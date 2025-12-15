import os
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine

# Load .env from PROJECT ROOT
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env file!")

engine = create_engine(DATABASE_URL)

def load_csv_to_db(csv_path: str, table_name="raw_transactions") -> pd.DataFrame:
    """
    Load CSV into raw_transactions table and return pandas DataFrame.
    """
    csv_path = str(csv_path)  # <-- convert Path to string
    print(f"Database URL: {DATABASE_URL}")
    print(f"Loading CSV from {csv_path}...")
    df = pd.read_csv(csv_path)

    print(f"Initial rows: {len(df)}")

    print(df.head())
    print(df.describe())
    print(df.info())

    # duplicates
    duplicates = df[df.duplicated(keep=False)]
    print(f"Duplicates: {len(duplicates)}")
    print(f"Found {duplicates.shape[0]} duplicate rows")
    print(duplicates)

    # Load to raw_transactions table
    df.to_sql(table_name, con=engine, if_exists="replace", index=False)
    print(f"CSV loaded into '{table_name}' successfully ✅")
    print("EXTRACTING COMPLETED SUCCESSFULLY")
    return df

