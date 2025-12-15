from django.db import connection

def clean_raw_transactions(table1="raw_transactions", table2="warehouse"):
    """
    Cleans the raw table and writes cleaned records into the clean table.
    Steps:
    1. Remove rows with null customer_id, amount, or transaction_type
    2. Normalize transaction_type
    3. Remove duplicates based on (customer_id, transaction_date, amount, transaction_type)
    """

    # fetch all raw records
    with connection.cursor() as cursor:
        cursor.execute(f"SELECT * FROM {table1}")
        columns = [col[0] for col in cursor.description]
        rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

    seen = set()
    cleaned = []

    # Counters for reporting
    nulls_count = 0
    invalid_tx_count = 0
    duplicates_count = 0

    for record in rows:

        # remove nulls
        if not record.get("Customer ID") or not record.get("Transaction Amount") or not record.get("Transaction Type"):
            nulls_count += 1
            continue

        # Normalize the transaction type
        transaction_type = str(record.get("Transaction Type")).strip()
        if transaction_type not in ["Deposit", "Withdrawal", "Transfer"]:
            invalid_tx_count += 1
            continue

        # Remove duplicates
        duplicates_key=(
            record.get("Customer ID"),
            record.get("Transaction Amount"),
            record.get("Transaction Type"),
            record.get("Transaction Date"),
        )

        if duplicates_key in seen:
            duplicates_count +=1
            continue
        seen.add(duplicates_key)

        # Keep cleaned record
        cleaned.append(record)

    # insert cleaned data/records into table2
    if cleaned:
        print(f"{len(cleaned)} records were cleaned")
        cols = cleaned[0].keys()
        columns_sql = ", ".join(cols)
        placeholders = ", ".join(["%s"] * len(cols))
        values = [tuple(r[col] for col in cols) for r in cleaned]

        with connection.cursor() as cursor:
            cursor.execute(f"DELETE FROM {table2}")
            sql = f"INSERT INTO {table2} ({columns_sql}) VALUES ({placeholders})"
            cursor.executemany(sql, values)

    # Print affected rows
    print(f"Total raw rows: {len(rows)}")
    print(f"Rows removed due to nulls: {nulls_count}")
    print(f"Rows removed due to invalid transaction type: {invalid_tx_count}")
    print(f"Rows removed due to duplicates: {duplicates_count}")
    print(f"Total cleaned rows inserted into {table2}: {len(cleaned)}")