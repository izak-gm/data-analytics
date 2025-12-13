import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import type { BankingRecord } from "@/types/Transaction";
import  { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import api from "@/utils/axios";
import { formatDate, normalizeGender, parseAmount } from "@/utils/formatter";

export default function BankingTransactionCard() {
  // const [_bankingRecordResponse, setBankingRecordResponse] = useState<any>(null);
  const [bankingRecord, setBankingRecord] = useState<BankingRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(""); // Search state

  const rowsPerPage = 1000;
  
  const fetchBankingRecord = async () => {
    try {
      const response = await api.get("all-records/transactions/");
      console.log("The abnking data",response.data);
      // setBankingRecordResponse(response.data); // full response
      setBankingRecord(response.data.results); // current page records
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBankingRecord();
  }, []);

  // // filter function by first or last name
  const filteredData = bankingRecord.filter((txn) => {
    const query = search.toLowerCase();
    return (
      txn.first_name?.toLowerCase().includes(query) ||
      txn.last_name?.toLowerCase().includes(query)
    );
  });
  console.log("filterd data ",filteredData)

  // pagination logic (after filtering)
  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  console.log("pagenation data ",currentData)

  return (
    <div className="p-4 mx-auto space-y-4">
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">
            Banking Data (Page {currentPage} of {totalPages})
          </CardTitle>

          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by first or last name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset to first page on new search
            }}
            className="px-3 py-2 border rounded-lg w-64"
          />
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-gray-100 z-10">
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Transaction Date</TableHead>
                  <TableHead>Transaction Type</TableHead>
                  <TableHead>Account Balance</TableHead>
                  <TableHead>Transaction Amount</TableHead>
                  <TableHead>Account Balance after Transaction</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Branch Code</TableHead>
                  <TableHead>Account Opening Date</TableHead>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Loan Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((txn, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell>{txn.customer_id}</TableCell>
                    <TableCell>{txn.first_name}</TableCell>
                    <TableCell>{txn.last_name}</TableCell>
                    <TableCell>{txn.transaction_id}</TableCell>
                    <TableCell>{formatDate(txn.transaction_date)}</TableCell>
                    <TableCell>{txn.transaction_type}</TableCell>
                    <TableCell>
                      {txn.account_balance_after_transaction}
                    </TableCell>
                    <TableCell>{parseAmount(txn.transaction_amount)}</TableCell>
                    <TableCell>{parseAmount(txn.account_balance)}</TableCell>
                    <TableCell>{txn.age}</TableCell>
                    <TableCell>{normalizeGender(txn.gender)}</TableCell>
                    <TableCell>{txn.account_type}</TableCell>
                    <TableCell>{txn.branch_id}</TableCell>
                    <TableCell>
                      {formatDate(txn.date_of_account_opening)}
                    </TableCell>
                    <TableCell>{txn.loan_id}</TableCell>
                    <TableCell>{parseAmount(txn.loan_amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            {/* Page numbers */}
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, currentPage - 3),
                  Math.min(totalPages, currentPage + 2)
                )
                .map((page) => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
            </div>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

