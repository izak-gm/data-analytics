from django.db import connection
from django.shortcuts import render
from django.views import View
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet


# Create your views here.
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
            cursor.execute('''
            WITH orderedTransactions AS(
                SELECT 
                    "Customer ID" AS customer_id,
                    "CardID" AS card_id,
                    "TransactionID" AS transaction_id,
                    "Transaction Type" AS transaction_type,
                    "Transaction Date" AS transaction_date,
                    "Transaction Amount" AS transaction_amount,
                    -- Account Balance is account balance before transaction is made
                    "Account Balance" AS account_balance, 
                    -- Account balance after the transaction
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
                        -- First transaction: use account_balance as base for validation
                        WHEN account_balance_before_transaction IS NULL
                            AND transaction_type = 'Deposit'
                            AND account_balance_after_transaction = account_balance + transaction_amount THEN 'VALID'
                        WHEN account_balance_before_transaction IS NULL
                            AND transaction_type = 'Withdrawal'
                            AND account_balance_after_transaction = account_balance - transaction_amount THEN 'VALID'
                        WHEN account_balance_before_transaction IS NULL
                            AND transaction_type = 'Transfer'
                            AND account_balance_after_transaction = account_balance - transaction_amount THEN 'VALID'
                    
                        -- Subsequent transactions
                        WHEN transaction_type = 'Deposit'
                            AND account_balance_after_transaction = account_balance_before_transaction + transaction_amount THEN 'VALID'
                        WHEN transaction_type = 'Withdrawal'
                            AND account_balance_after_transaction = account_balance_before_transaction - transaction_amount THEN 'VALID'
                        WHEN transaction_type = 'Transfer'
                            AND account_balance_after_transaction = account_balance_before_transaction - transaction_amount THEN 'VALID'
                        
                        ELSE 'INVALID'
                    END AS transaction_status,

                    CASE
                        WHEN transaction_type = 'Deposit'
                            AND account_balance_after_transaction <> account_balance_before_transaction + transaction_amount
                            THEN 'Balance mismatch for credit'
                        WHEN transaction_type = 'Withdrawal' 
                            AND account_balance_after_transaction <> account_balance_before_transaction - transaction_amount
                            THEN 'Balance mismatch for Withdrawal'
                        WHEN transaction_type = 'Transfer' 
                            AND account_balance_after_transaction <> account_balance_before_transaction - transaction_amount
                            THEN 'Balance mismatch for Transfer'
                        WHEN transaction_type NOT IN ('Deposit','Withdrawal','Transfer')
                            THEN 'Unknown transaction type'
                        ELSE 'Unclassified Validation error'
                    END AS error_reason
                FROM orderedTransactions
            )
            SELECT *,
                COUNT(*) OVER () AS total_records,
                COUNT(*) FILTER (WHERE transaction_status = 'VALID') OVER () AS valid_records,
                COUNT(*) FILTER (WHERE transaction_status = 'INVALID') OVER () AS invalid_records
            FROM validated
            ORDER BY customer_id, card_id, transaction_id, transaction_date
            ''')

            columns = [col[0] for col in cursor.description]
            data = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response({
            "total_records": data[0]["total_records"] if data else 0,
            "valid_records": data[0]["valid_records"] if data else 0,
            "invalid_records": data[0]["invalid_records"] if data else 0,
            "data": data,
        })
