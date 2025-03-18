import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const RevenueChart = ({ revenue }) => {
  const data = [
    { name: "Jan", revenue: revenue * 0.1 },
    { name: "Feb", revenue: revenue * 0.3 },
    { name: "Mar", revenue: revenue * 0.5 },
    { name: "Apr", revenue: revenue * 0.7 },
    { name: "May", revenue: revenue * 0.9 },
    { name: "Jun", revenue: revenue },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;