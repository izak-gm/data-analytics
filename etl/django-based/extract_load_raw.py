from django.db import connection

def load_csv_directly(csv_path, table_name="raw_transactions"):
    with connection.cursor() as cursor:
        with open(csv_path, "r", encoding="utf-8") as f:
            cursor.copy_expert(
                f"""
                COPY {table_name}
                FROM STDIN
                WITH CSV HEADER
                """,
                f,
            )
    print(f"🚀 CSV loaded into {table_name} using COPY")
    print(f"✅ Loaded  rows directly into {table_name}")
