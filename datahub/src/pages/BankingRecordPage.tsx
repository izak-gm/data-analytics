import BankingTransactionCard from "@/components/app/AllBankingRecords";
import type { BankingRecord } from "@/types/Transaction";
import { useEffect, useState } from "react";

export default function ValidationPage() {
  const [bankingData, setBankingData] = useState<BankingRecord[]>([]);

  // fetch CSV
  const fetchDatafromCSVfile = async () => {
    try {
      const data = await parseBankingCSV(
        "/data/Comprehensive_Banking_Database.csv"
      );
      setBankingData(data);
    } catch (error) {
      console.error("Error fetching CSV:", error);
    }
  };

  useEffect(() => {
    fetchDatafromCSVfile();
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Data Validation Dashboard</h1>
      <BankingTransactionCard records={bankingData} />
    </div>
  );
}
