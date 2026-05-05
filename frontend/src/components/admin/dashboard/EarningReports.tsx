"use client";

import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface EarningReportsProps {
  data: any[];
}

const EarningReports: React.FC<EarningReportsProps> = ({ data }) => {
  const totalWeekly = data.reduce((acc, curr) => acc + Number(curr.revenue), 0);
  const netProfit = totalWeekly * 0.4; // 40% margin
  const totalIncome = totalWeekly * 0.85; // 85% of gross

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#2D3B29]">Earning Reports</h2>
        <p className="text-sm text-gray-400 font-medium">Weekly Overview</p>
      </div>

      <div className="flex items-end gap-3 mb-8">
        <h3 className="text-3xl font-black text-[#2D3B29]">Rs. {totalWeekly.toLocaleString()}</h3>
        <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold mb-1">
          <TrendingUp size={14} />
          <span>+{(totalWeekly > 0 ? 12.4 : 0)}%</span>
        </div>
      </div>

      <div className="flex-1 min-h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="day" 
              hide={false} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }} 
              dy={10}
            />
            <Tooltip 
              cursor={{ fill: '#f8faf7' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              formatter={(value: any) => `Rs. ${Number(value).toLocaleString()}`}
            />
            <Bar dataKey="revenue" radius={[6, 6, 6, 6]} barSize={22}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === data.length - 1 ? '#629D23' : '#e5e7eb'} 
                  className="hover:fill-[#629D23] transition-all duration-300 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-[#629D23]">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Net Profit</p>
            <p className="text-sm font-black text-[#2D3B29]">Rs. {Math.round(netProfit).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Total Income</p>
            <p className="text-sm font-black text-[#2D3B29]">Rs. {Math.round(totalIncome).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningReports;
