"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface OrderStatisticsProps {
  data: any[];
}

const COLORS = ['#629D23', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

const OrderStatistics: React.FC<OrderStatisticsProps> = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.status,
    value: Number(item.count)
  }));

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#2D3B29]">Order Statistics</h2>
        <p className="text-sm text-gray-400 font-medium">Total {total} Orders</p>
      </div>

      <div className="flex-1 min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-3xl font-black text-[#2D3B29]">{total}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span className="text-xs font-bold text-gray-600 truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatistics;
