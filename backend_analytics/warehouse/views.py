from django.db import connection
from django.shortcuts import render
from django.views import View
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet


# Create your views here.
class LargeResultsSetPagination(PageNumberPagination):
    page_size = 1000        # number of records per page
    page_size_query_param = 'page_size'
    max_page_size = 5000

class GenerateAllRecordsForTransactions(ViewSet):
    pagination_class = LargeResultsSetPagination

    @action(detail=False, methods=['get'], url_path='transactions')
    def all_records(self, request):
        with connection.cursor() as cursor:
            cursor.execute('''select 
                                "Customer ID" AS customer_id,
                                "First Name" AS first_name,
                                "Last Name" AS last_name,
                                "Age" AS age,
                                "Gender" AS gender,
                                "Email" AS email,
                                "Account Type" AS account_type,
                                "Account Balance" AS account_balance,
                                "Date Of Account Opening" AS date_of_account_opening,
                                "TransactionID" AS transaction_id,
                                "Transaction Type" AS transaction_type,
                                "Transaction Date" AS transaction_date,
                                "Transaction Amount" AS transaction_amount,
                                "Account Balance After Transaction" AS account_balance_after_transaction,
                                "Branch ID" AS branch_id,
                                "Loan ID" AS loan_id
                           from warehouse''')
            columns = [col[0] for col in cursor.description]
            records = [dict(zip(columns,row)) for row in cursor.fetchall()]

        # paginate
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(records, request)
        return paginator.get_paginated_response(records)

# loans disbursed by the branch
class WarehouseAnalyticsViewSet(ViewSet):

    @action(detail=False, methods=['get'], url_path='loans-by-branch')
    def loanByBranchFromWarehouse(self, request, pk=None):
        with connection.cursor() as cursor:
            cursor.execute('''
                        SELECT "Branch ID" AS branch_id,
                               COUNT(*) AS total_loans,
                               SUM("Loan Amount") AS total_disbursed
                        FROM warehouse
                        GROUP BY "Branch ID"
                        ORDER BY total_disbursed DESC
                    ''')
            columns=[col[0] for col in cursor.description]
            data=[dict(zip(columns,row)) for row in cursor.fetchall()]

        return Response(data)
class BranchPerformancePerTotals(ViewSet):

    @action(detail=False, methods=['get'], url_path='records-by-branch')
    def branch_performance_per_totals(self, request, pk=None):
        with connection.cursor() as cursor:
            cursor.execute('''
                    SELECT
                        "Branch ID" AS branch_id,
                        EXTRACT(
                            YEAR FROM TO_DATE("Transaction Date", 'MM/DD/YYYY')
                        ) AS year,
                        SUM("Transaction Amount") AS branch_yearly_total,
                        SUM(SUM("Transaction Amount")) OVER (
                            PARTITION BY EXTRACT(
                                YEAR FROM TO_DATE("Transaction Date", 'MM/DD/YYYY')
                            )
                        ) AS yearly_total_transaction_amount
                    FROM warehouse
                    GROUP BY branch_id, year
                    ORDER BY year, branch_yearly_total DESC;

            ''')
            columns = [col[0] for col in cursor.description]
            data = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(data)
class ValidateTransactions(ViewSet):
    """
       Returns all transactions with:
       - balance_before
       - validation status
       - error reason for invalid records
       - counts of total, valid, and invalid records
    """

    @action(detail=False, methods=['get'], url_path='validate-transactions')
    def validateTransactions(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                WITH orderedTransactions AS (
                    SELECT 
                        "Customer ID" AS customer_id,
                        "First Name" AS first_name,
                        "Last Name" AS last_name,                        
                        "CardID" AS card_id,
                        "TransactionID" AS transaction_id,
                        "Transaction Type" AS transaction_type,
                        "Transaction Date" AS transaction_date,
                        "Transaction Amount" AS transaction_amount,
                        "Account Balance" AS account_balance,
                        "Account Balance After Transaction" AS account_balance_after_transaction,
                        LAG("Account Balance After Transaction")
                            OVER (
                                PARTITION BY "Customer ID", "Account Type"
                                ORDER BY "Transaction Date", "TransactionID"
                            ) AS account_balance_before_transaction
                    FROM warehouse
                ),
                validated AS (
                    SELECT *,
                        CASE
                            WHEN account_balance_after_transaction IS NULL THEN 'VALID'
                            WHEN account_balance_before_transaction IS NULL
                                AND transaction_type = 'Deposit'
                                AND account_balance_after_transaction = account_balance + transaction_amount
                                THEN 'VALID'
                            WHEN account_balance_before_transaction IS NULL
                                AND transaction_type IN ('Withdrawal','Transfer')
                                AND account_balance_after_transaction = account_balance - transaction_amount
                                THEN 'VALID'
                            WHEN transaction_type = 'Deposit'
                                AND account_balance_after_transaction = account_balance_before_transaction + transaction_amount
                                THEN 'VALID'
                            WHEN transaction_type IN ('Withdrawal','Transfer')
                                AND account_balance_after_transaction = account_balance_before_transaction - transaction_amount
                                THEN 'VALID'
                            ELSE 'INVALID'
                        END AS transaction_status,

                        CASE
                            WHEN account_balance_after_transaction IS NULL THEN NULL
                            WHEN account_balance_before_transaction IS NULL
                                AND transaction_type = 'Deposit'
                                AND account_balance_after_transaction IS DISTINCT FROM account_balance + transaction_amount
                                THEN 'Balance mismatch for first Deposit'
                            WHEN account_balance_before_transaction IS NULL
                                AND transaction_type IN ('Withdrawal','Transfer')
                                AND account_balance_after_transaction IS DISTINCT FROM account_balance - transaction_amount
                                THEN 'Balance mismatch for first Transaction'
                            WHEN transaction_type = 'Deposit'
                                AND account_balance_after_transaction IS DISTINCT FROM account_balance_before_transaction + transaction_amount
                                THEN 'Balance mismatch for Deposit'
                            WHEN transaction_type IN ('Withdrawal','Transfer')
                                AND account_balance_after_transaction IS DISTINCT FROM account_balance_before_transaction - transaction_amount
                                THEN 'Balance mismatch for Transaction'
                            WHEN transaction_type NOT IN ('Deposit','Withdrawal','Transfer')
                                THEN 'Unknown transaction type'
                            ELSE NULL
                        END AS error_reason
                    FROM orderedTransactions
                )
                SELECT * FROM validated
                ORDER BY customer_id, card_id, transaction_id, transaction_date;
            """)

            columns = [col[0] for col in cursor.description]
            rows = [dict(zip(columns, row)) for row in cursor.fetchall()]

        # ----------------------------
        # Python-side structuring
        # ----------------------------
        valid_records = []
        invalid_records = []

        for row in rows:
            record = row.copy()
            error = record.pop("error_reason", None)
            status = record.pop("transaction_status")

            if status == "VALID":
                record["is_valid"] = True
                valid_records.append(record)
            else:
                record["is_valid"] = False
                invalid_records.append({
                    "record": record,
                    "reasons": [error] if error else []
                })

        return Response({
            "total_records": len(rows),
            "valid_count": len(valid_records),
            "invalid_count": len(invalid_records),
            "valid_records": valid_records,
            "invalid_records": invalid_records,
        })
