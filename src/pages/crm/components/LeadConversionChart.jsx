import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const LeadConversionChart = ({ conversionRate }) => {
  const data = [
    { name: "Converted", value: parseFloat(conversionRate) },
    { name: "Not Converted", value: 100 - parseFloat(conversionRate) },
  ];

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default LeadConversionChart;