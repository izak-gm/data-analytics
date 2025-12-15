import pandas as pd
from sqlalchemy import create_engine
from extract import engine  # reuse the engine from extract.py

def clean_transactions(table1="raw_transactions", table2="warehouse"):
    """
    Cleans raw transactions from table1 and inserts cleaned data into table2.
    """
    # Read raw data
    df = pd.read_sql(f"SELECT * FROM {table1}", engine)
    total_rows = len(df)

    # Drop rows with nulls in essential columns
    df = df.dropna(subset=["Customer ID", "Transaction Amount", "Transaction Type"])
    nulls_removed = total_rows - len(df)

    # Keep only valid transaction types
    valid_types = ["Deposit", "Withdrawal", "Transfer"]
    df = df[df["Transaction Type"].str.strip().isin(valid_types)]
    invalid_tx_removed = total_rows - nulls_removed - len(df)

    # Remove duplicates
    df = df.drop_duplicates(subset=["Customer ID", "Transaction Amount", "Transaction Type", "Transaction Date"])
    duplicates_removed = total_rows - nulls_removed - invalid_tx_removed - len(df)

    print(f"Total raw rows: {total_rows}")
    print(f"Rows removed due to nulls: {nulls_removed}")
    print(f"Rows removed due to invalid transaction type: {invalid_tx_removed}")
    print(f"Rows removed due to duplicates: {duplicates_removed}")
    print(f"Total cleaned rows: {len(df)}")

    # Insert cleaned data into warehouse
    df.to_sql(table2, con=engine, if_exists="replace", index=False)
    print(f"Cleaned data loaded into '{table2}' successfully ✅")
    return df
