import ValidInvalidRecords from "@/components/app/ValidInvalidRecords";
import type { BankingRecord } from "@/types/Transaction";
import api from "@/utils/axios";
import { useEffect, useState } from "react";

export default function ValidInvalidPage() {
  const [bankingData, setBankingData] = useState<BankingRecord[]>([]);

  // fetch CSV
  const fetchDatafromDatabase = async () => {
    try {
      const response = await api.get(
        "/validate/validate-transactions/"
      );
      setBankingData(response.data);
    } catch (error) {
      console.error("Error fetching CSV:", error);
    }
  };

  useEffect(() => {
    fetchDatafromDatabase();
  }, []);
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Data Validation Dashboard</h1>
      <ValidInvalidRecords records={bankingData} />
    </div>
  );
}
