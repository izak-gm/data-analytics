import api from "@/utils/axios";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BranchRecord = {
  branch_id: number;
  branch_yearly_total: number;
  yearly_total_transaction_amount: number;
};

export default function BranchesPerformanceRecords() {
  const [data, setData] = useState<BranchRecord[]>([]);
  const [yearlyTotal, setYearlyTotal] = useState<number>(0);

  const fetchBankingRecord = async () => {
    try {
      const response = await api.get("all-records/records-by-branch/");
      const records = response.data;
      setData(records);

      if (records.length > 0) {
        setYearlyTotal(records[0].yearly_total_transaction_amount);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBankingRecord();
  }, []);

  // Derived KPIs
  const avgBranch = data.length
    ? data.reduce((sum, b) => sum + b.branch_yearly_total, 0) / data.length
    : 0;

  const topBranch = data.length
    ? data.reduce(
        (max, b) => (b.branch_yearly_total > max.branch_yearly_total ? b : max),
        data[0]
      )
    : null;

  const bottomBranch = data.length
    ? data.reduce(
        (min, b) => (b.branch_yearly_total < min.branch_yearly_total ? b : min),
        data[0]
      )
    : null;

  const top3Sum = data
    .sort((a, b) => b.branch_yearly_total - a.branch_yearly_total)
    .slice(0, 3)
    .reduce((sum, b) => sum + b.branch_yearly_total, 0);

  const contribution = yearlyTotal ? (top3Sum / yearlyTotal) * 100 : 0;

  const aboveAvgBranches = data.filter(
    (b) => b.branch_yearly_total > avgBranch
  ).length;

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Total Transaction Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              Ksh {yearlyTotal.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Average per Branch</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              Ksh{" "}
              {avgBranch.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Top Branch</CardTitle>
          </CardHeader>
          <CardContent>
            {topBranch && (
              <p className="text-2xl font-bold">
                {topBranch.branch_id} → Ksh{" "}
                {topBranch.branch_yearly_total.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Bottom Branch</CardTitle>
          </CardHeader>
          <CardContent>
            {bottomBranch && (
              <p className="text-2xl font-bold">
                {bottomBranch.branch_id} → Ksh{" "}
                {bottomBranch.branch_yearly_total.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Top 3 Branches Contribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{contribution.toFixed(2)}%</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader>
            <CardTitle>Branches Above Average</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{aboveAvgBranches}</p>
          </CardContent>
        </Card>
      </div>

      {/* BAR CHART */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Branches by Yearly Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="branch_id">
                <Label value="Branch ID" position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label value="Amount (Ksh)" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip
                formatter={(value?: number) =>
                  value !== undefined
                    ? value.toLocaleString("en-US", {
                        style: "currency",
                        currency: "KES",
                      })
                    : "-"
                }
              />

              <Bar
                dataKey="branch_yearly_total"
                radius={[6, 6, 0, 0]}
                fill="#3b82f6" // blue bars
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
