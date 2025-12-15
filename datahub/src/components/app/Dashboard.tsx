"use client";

import { useState } from "react";
import { Menu } from "lucide-react";


import BranchesPerformanceRecords from "./BranchPerformance";
import type { BankingRecord } from "@/types/Transaction";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A855F7"];

export default function Dashboard() {
  const [_sidebarOpen, setSidebarOpen] = useState(false);


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
          <BranchesPerformanceRecords/>
          {/* Seasonal Trends */}
          {/* <Card>
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
          </Card> */}
{/* 
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
          </div> */}
        </main>
      </div>
    </div>
  );
}
