"use client";

import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label,
} from "recharts";

import { parseBankingCSV } from "@/utilities/csvParser";
import type { BankingRecord } from "@/types/BankingRecord";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  getTopBranches,
  getSeasonalTrends,
  detectAnomalousTransactions,
  getCustomerContribution,
  getTopCustomersLTV,
} from "@/helpers/helper";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7"];

export default function Dashboard() {
  const [_sidebarOpen, setSidebarOpen] = useState(false);
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

  // Prepare chart data
  const topBranches = getTopBranches(bankingData, 10); // top 10
  const seasonalTrends = getSeasonalTrends(bankingData);
  const _anomalies = detectAnomalousTransactions(bankingData);
  const customerContribution = getCustomerContribution(bankingData, 10);
  const topCustomers = getTopCustomersLTV(bankingData, 10);

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Banking Analytics</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, Isaac Maingi</span>
          </div>
        </header>
        <p className="flex text-green-500">
          Other answers find a pdf attached with the pushed repository
          /docs/Frontend Engineering Assessment.pdf
        </p>
        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Branch Performance (Top 10) */}
          <Card className="shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-700">
                Top 10 Branches by Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={topBranches}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="branch"
                    tick={{ fontSize: 12, fill: "#374151" }}
                  >
                    <Label
                      value="Branch Code"
                      offset={-5}
                      position="insideBottom"
                      style={{ fill: "#6b7280" }}
                    />
                  </XAxis>
                  <YAxis tick={{ fontSize: 12, fill: "#374151" }}>
                    <Label
                      value="Amount (Ksh)"
                      angle={-90}
                      position="insideLeft"
                      style={{ fill: "#6b7280" }}
                    />
                  </YAxis>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Seasonal Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Trends (All Branches)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={seasonalTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month">
                    <Label value="Month" offset={-5} position="insideBottom" />
                  </XAxis>
                  <YAxis>
                    <Label
                      value="Amount (Ksh)"
                      angle={-90}
                      position="insideLeft"
                    />
                  </YAxis>
                  <Tooltip />
                  <Line type="monotone" dataKey="avg" stroke="#0088FE" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="flex grid-cols-2 gap-4">
            <Card className="w-2/5">
              <CardHeader>
                <CardTitle>Customer Contribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        {
                          name: "Top 10 Customers",
                          value: customerContribution.topShare,
                        },
                        {
                          name: "Other Customers",
                          value: customerContribution.restShare,
                        },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={70}
                      label
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="w-3/5">
              <CardHeader> Top Customers (LTV)</CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topCustomers}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="customerId">
                      <Label
                        value="Customer ID"
                        offset={-5}
                        position="insideBottom"
                      />
                    </XAxis>
                    <YAxis>
                      <Label
                        value="Amount (Ksh"
                        angle={-90}
                        position="insideLeft"
                      />
                    </YAxis>
                    <Tooltip />
                    <Bar dataKey="ltv" fill="#A855F7" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
