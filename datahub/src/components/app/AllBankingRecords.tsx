import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import type { BankingRecord } from "@/types/Transaction";

export default function BankingTransactionCard() {
  const [bankingRecord, setBankingRecord] = useState<BankingRecord[]>([]);

  const fetchBankingRecord = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/hf-analytics/hfc/loans-by-branch/ "
      );
      // const result = await response.json();
      console.log(response);
      // setBankingRecord(result)
    } catch (error) {}
  };

  useEffect(() => {
    fetchBankingRecord();
  }, []);
  return (
    <div>
      <Card>
        
      </Card>
    </div>
  );
}
