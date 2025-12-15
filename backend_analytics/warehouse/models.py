from django.db import models

# Create your models here.
class Transaction(models.Model):
    WITHDRAWAL = 'withdrawal'
    DEPOSIT = 'deposit'

    TRANSACTION_CHOICES = [
        (WITHDRAWAL, 'Withdrawal'),
        (DEPOSIT, 'Deposit'),
    ]

    REJECTED= 'Rejected'
    APPROVED = 'Approved'
    CLOSED = 'Closed'
    LOAN_STATUS_CHOICES = [(REJECTED,'Rejected'), (APPROVED,'Approved'),(CLOSED,"Closed"),]

    PENDING = 'Pending'
    RESOLVED = 'Resolved'
    RESOLUTION_CHOICES = [(PENDING,'Pending'), (RESOLVED,'Resolved'),]

    customerId = models.IntegerField()
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    address = models.TextField()
    city = models.CharField(max_length=100)
    contactNumber=models.CharField(max_length=100)
    email = models.EmailField()
    transactionType = models.CharField(
        max_length=100,
        choices=TRANSACTION_CHOICES,
    )
    accountType = models.CharField(max_length=100)
    accountBalance = models.FloatField()
    dateOfAccountOpening = models.DateField()
    lastTransactionDate = models.DateField()
    transactionId = models.IntegerField()
    transactionDate = models.DateField()
    transactionAmount = models.FloatField()
    accountBalanceAfterTransaction = models.FloatField()
    branchId = models.IntegerField()
    loanId = models.IntegerField()
    loanAmount = models.FloatField()
    loanType=models.CharField(max_length=100)
    interestRate=models.FloatField()
    loanTerm=models.IntegerField()
    approvalRejectionDate=models.DateField()
    loanStatus=models.CharField(
        max_length=100,
        choices=LOAN_STATUS_CHOICES)
    cardId=models.IntegerField()
    cardType=models.CharField(max_length=100)
    creditLimit=models.FloatField()
    creditLimitBalance=models.FloatField()
    minimumPaymentDue=models.DateField()
    paymentDueDate=models.DateField()
    lastCreditCardPaymentDate=models.DateField()
    rewardsPoints=models.IntegerField()
    feedbackId=models.IntegerField()
    feedbackDate=models.DateField()
    feedbackType=models.CharField(max_length=100)
    resolutionStatus=models.CharField(
        max_length=100,
        choices=RESOLUTION_CHOICES)
    resolutionAmount=models.FloatField()
    resolutionDate=models.DateField()
    anomality=models.FloatField()

    class Meta:
        db_table = 'warehouse'
        managed = False

class RawTransaction(models.Model):
    WITHDRAWAL = 'withdrawal'
    DEPOSIT = 'deposit'

    TRANSACTION_CHOICES = [
        (WITHDRAWAL, 'Withdrawal'),
        (DEPOSIT, 'Deposit'),
    ]

    REJECTED= 'Rejected'
    APPROVED = 'Approved'
    CLOSED = 'Closed'
    LOAN_STATUS_CHOICES = [(REJECTED,'Rejected'), (APPROVED,'Approved'),(CLOSED,"Closed"),]

    PENDING = 'Pending'
    RESOLVED = 'Resolved'
    RESOLUTION_CHOICES = [(PENDING,'Pending'), (RESOLVED,'Resolved'),]

    customerId = models.IntegerField()
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10)
    address = models.TextField()
    city = models.CharField(max_length=100)
    contactNumber=models.CharField(max_length=100)
    email = models.EmailField()
    transactionType = models.CharField(
        max_length=100,
        choices=TRANSACTION_CHOICES,
    )
    accountType = models.CharField(max_length=100)
    accountBalance = models.FloatField()
    dateOfAccountOpening = models.DateField()
    lastTransactionDate = models.DateField()
    transactionId = models.IntegerField()
    transactionDate = models.DateField()
    transactionAmount = models.FloatField()
    accountBalanceAfterTransaction = models.FloatField()
    branchId = models.IntegerField()
    loanId = models.IntegerField()
    loanAmount = models.FloatField()
    loanType=models.CharField(max_length=100)
    interestRate=models.FloatField()
    loanTerm=models.IntegerField()
    approvalRejectionDate=models.DateField()
    loanStatus=models.CharField(
        max_length=100,
        choices=LOAN_STATUS_CHOICES)
    cardId=models.IntegerField()
    cardType=models.CharField(max_length=100)
    creditLimit=models.FloatField()
    creditLimitBalance=models.FloatField()
    minimumPaymentDue=models.DateField()
    paymentDueDate=models.DateField()
    lastCreditCardPaymentDate=models.DateField()
    rewardsPoints=models.IntegerField()
    feedbackId=models.IntegerField()
    feedbackDate=models.DateField()
    feedbackType=models.CharField(max_length=100)
    resolutionStatus=models.CharField(
        max_length=100,
        choices=RESOLUTION_CHOICES)
    resolutionAmount=models.FloatField()
    resolutionDate=models.DateField()
    anomality=models.FloatField()

    class Meta:
        db_table = 'raw_transactions'
        managed = False