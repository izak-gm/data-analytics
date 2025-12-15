import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { parseAmount } from "@/utils/formatter";
import api from "@/utils/axios";
import type { BankingRecord } from "@/types/Transaction";


interface Props {
  records: BankingRecord[];
}

export default function ValidInvalidRecords({ records }: Props) {
const [validRecords, setValidRecords] = useState<BankingRecord[]>([]);
const [invalidRecords, setInvalidRecords] = useState<
  { record: BankingRecord; reasons: string[] }[]
  >([]);
  
  const [validPage, setValidPage] = useState(1);
  const [invalidPage, setInvalidPage] = useState(1);

  const [search, setSearch] = useState(""); // 🔍 Search state

  const rowsPerPage = 1000;


 const fetchDatafromDatabase = async () => {
  try {
    const response = await api.get("/validate/validate-transactions/");

    console.log(response)
    
    setValidRecords(response.data.valid_records ?? []);
    setInvalidRecords(response.data.invalid_records ?? []);
    console.log(response.data.valid_records)
    console.log(response.data.invalid_records)

    setValidPage(1);
    setInvalidPage(1);
  } catch (error) {
    console.error("Error fetching records:", error);
  }
};


  useEffect(() => {
    fetchDatafromDatabase();

    setValidPage(1);
    setInvalidPage(1);
  }, [records]);

  // filter function by first or last name
  const filterByName = (first_name: string, last_name: string) => {
    const query = search.toLowerCase();
    return (
      first_name?.toLowerCase().includes(query) ||
      last_name?.toLowerCase().includes(query)
    );
  };

  // Apply filtering
const filteredValidRecords = validRecords.filter((r) =>
  filterByName(r.first_name, r.last_name)
);
console.log("Valid filterd",filteredValidRecords)
const filteredInvalidRecords = invalidRecords.filter(({ record }) =>
  filterByName(record.first_name, record.last_name)
);
console.log("IvValid filterd",filteredInvalidRecords)

  // pagination logic (applied after filtering)
  const totalValidPages =
    Math.ceil(filteredValidRecords.length / rowsPerPage) || 1;
  const validStartIndex = (validPage - 1) * rowsPerPage;
  const currentValidData = filteredValidRecords.slice(
    validStartIndex,
    validStartIndex + rowsPerPage
  );

  const totalInvalidPages =
    Math.ceil(filteredInvalidRecords.length / rowsPerPage) || 1;
  const invalidStartIndex = (invalidPage - 1) * rowsPerPage;
  const currentInvalidData = filteredInvalidRecords.slice(
    invalidStartIndex,
    invalidStartIndex + rowsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-700">Valid Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{filteredValidRecords.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-700">Invalid Records</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {filteredInvalidRecords.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search Input */}
      <div className="flex justify-end">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setValidPage(1);
            setInvalidPage(1);
          }}
          className="px-3 py-2 border rounded w-64"
        />
      </div>

      {/* Tabs for Records */}
      <Tabs defaultValue="valid" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="valid">Valid Records</TabsTrigger>
          <TabsTrigger value="invalid">Invalid Records</TabsTrigger>
        </TabsList>

        {/* Valid Records Table */}
        <TabsContent value="valid">
          <Card>
            <CardHeader>
              <CardTitle>Valid Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Account Balance</TableHead>
                    <TableHead>Transaction Amount</TableHead>
                    <TableHead>Balance After Transaction</TableHead>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Loan Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentValidData.map((record, idx) => (
                    <TableRow key={record.transaction_date + idx}>
                      <TableCell>{record.customer_id}</TableCell>
                      <TableCell>
                        {record.first_name} {record.last_name}
                      </TableCell>
                      <TableCell>{record.age}</TableCell>
                      <TableCell>{record.transaction_type}</TableCell>
                      <TableCell>
                        {parseAmount(record.account_balance)}
                      </TableCell>
                      <TableCell>
                        {parseAmount(record.transaction_amount)}
                      </TableCell>
                      <TableCell>
                        {record.account_balance_after_transaction}
                      </TableCell>
                      <TableCell>{record.loan_id}</TableCell>
                      <TableCell>{parseAmount(record.loan_amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  disabled={validPage === 1}
                  onClick={() => setValidPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {validPage} of {totalValidPages}
                </span>
                <button
                  disabled={validPage === totalValidPages}
                  onClick={() => setValidPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invalid Records Table */}
        <TabsContent value="invalid">
          <Card>
            <CardHeader>
              <CardTitle>Invalid Records & Errors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Transaction Type</TableHead>
                    <TableHead>Account Balance</TableHead>
                    <TableHead>Transaction Amount</TableHead>
                    <TableHead>Balance After Transaction</TableHead>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Loan Amount</TableHead>
                    <TableHead>Errors</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentInvalidData.map(({ record, reasons }, idx) => (
                    <TableRow key={record.transaction_date + idx}>
                      <TableCell>{record.customer_id}</TableCell>
                      <TableCell>
                        {record.first_name} {record.last_name}
                      </TableCell>
                      <TableCell>{record.transaction_type}</TableCell>
                      <TableCell>
                        {parseAmount(record.account_balance)}
                      </TableCell>
                      <TableCell>
                        {parseAmount(record.transaction_amount)}
                      </TableCell>
                      <TableCell>
                        {record.account_balance_after_transaction}
                      </TableCell>
                      <TableCell>{record.loan_id}</TableCell>
                      <TableCell>{parseAmount(record.loan_amount)}</TableCell>
                      <TableCell>
                        <ul className="list-disc pl-4 text-red-600">
                          {reasons.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <button
                  disabled={invalidPage === 1}
                  onClick={() => setInvalidPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <span>
                  Page {invalidPage} of {totalInvalidPages}
                </span>
                <button
                  disabled={invalidPage === totalInvalidPages}
                  onClick={() => setInvalidPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
