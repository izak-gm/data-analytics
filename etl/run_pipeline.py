from pathlib import Path

from tranform import clean_transactions
from extract import load_csv_to_db

BASE_DIR = Path(__file__).resolve().parent.parent

def run_pipeline(csv_path: str):
    print("Starting ETL pipeline...")
    print(f"Loading {csv_path}")

    # Extract
    load_csv_to_db(csv_path)

    # Transform & Load
    clean_transactions()

    print("✅ ETL pipeline finished successfully!")

    print("Data cleaned and Transformed by Izak")
    print("Happy using the cleaned data? ")
    print("Then show a smile!")



if __name__ == "__main__":
    csv_file = BASE_DIR / "data-lake/raw/Comprehensive_Banking_Database.csv"
    run_pipeline(str(csv_file))  # <-- convert Path to string
