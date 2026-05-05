"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueReportProps {
  data: any[];
}

const RevenueReport: React.FC<RevenueReportProps> = ({ data }) => {
  const totalRevenue = data.reduce((acc, curr) => acc + Number(curr.revenue), 0);
  const estimatedProfit = totalRevenue * 0.45; // Assuming 45% profit margin for visualization
  const budget = totalRevenue * 1.2; // Mock budget as 120% of revenue for UI

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50 flex flex-col md:flex-row overflow-hidden h-full min-h-[400px]">
      {/* Left Side: Chart */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#2D3B29]">Revenue Report</h2>
            <p className="text-sm text-gray-400 font-medium">Monthly Earnings Trend</p>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#629D23]"></div>
              <span className="text-xs font-bold text-gray-500">Earnings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#2D3B29]"></div>
              <span className="text-xs font-bold text-gray-500">Profit</span>
            </div>
          </div>
        </div>
        
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 600 }} 
              />
              <Tooltip 
                cursor={{ fill: '#f8faf7' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => `Rs. ${Number(value).toLocaleString()}`}
              />
              <Bar 
                dataKey="revenue" 
                fill="#629D23" 
                radius={[6, 6, 0, 0]} 
                barSize={18}
                name="Earnings"
              />
              <Bar 
                dataKey="revenue" 
                fill="#2D3B29" 
                radius={[6, 6, 0, 0]} 
                barSize={18}
                name="Profit"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Right Side: Stats Panel (Vuexy Style) */}
      <div className="w-full md:w-[280px] bg-gray-50 p-8 border-l border-gray-100 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1.5 bg-white rounded-xl text-[#629D23] font-bold text-sm shadow-sm mb-4">
            Target Revenue
          </div>
          <h3 className="text-2xl font-black text-[#2D3B29]">Rs. {budget.toLocaleString()}</h3>
          <p className="text-sm text-gray-400 font-medium mt-1">Expected this Year</p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-[#2D3B29]">Profit Earned</span>
              <span className="text-sm font-black text-[#629D23]">Rs. {estimatedProfit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#629D23] h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-bold text-[#2D3B29]">Total Earnings</span>
              <span className="text-sm font-black text-[#2D3B29]">Rs. {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#2D3B29] h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        <button className="mt-10 w-full py-3 bg-[#629D23] text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-[#2D3B29] transition-all">
          View Detailed Analytics
        </button>
      </div>
    </div>
  );
};

export default RevenueReport;
