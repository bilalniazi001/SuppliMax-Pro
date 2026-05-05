'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';
import WelcomeCard from '@/components/admin/dashboard/WelcomeCard';
import StatsGrid from '@/components/admin/dashboard/StatsGrid';
import RevenueReport from '@/components/admin/dashboard/RevenueReport';
import OrderStatistics from '@/components/admin/dashboard/OrderStatistics';
import EarningReports from '@/components/admin/dashboard/EarningReports';
import PopularProducts from '@/components/admin/dashboard/PopularProducts';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/orders/dashboard/advanced`);
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (error) {
        console.error('Error fetching advanced dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#629D23]"></div>
          <p className="text-[#2D3B29] font-bold animate-pulse">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div className="p-10 text-center font-bold text-red-500">Failed to load dashboard data.</div>;

  return (
    <div className="p-1 space-y-8 animate-in fade-in duration-700 pb-12">
      
      {/* Top Section: Welcome & Mini Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 xl:col-span-8">
          <WelcomeCard revenue={data.cards.revenue} />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <StatsGrid 
            revenue={data.cards.revenue} 
            orders={data.cards.orders} 
            products={data.cards.products} 
            users={data.cards.users} 
          />
        </div>
      </div>

      {/* Middle Section: Revenue & Earnings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RevenueReport data={data.monthlyRevenue} />
        </div>
        <div className="lg:col-span-4">
          <EarningReports data={data.weeklySales} />
        </div>
      </div>

      {/* Bottom Section: Popular Products, Order Stats, Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <PopularProducts products={data.topProducts} />
        </div>
        <div className="lg:col-span-4">
          <OrderStatistics data={data.orderStats} />
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-gray-50 h-full">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-[#2D3B29]">Recent Activity</h2>
              <Link href="/admin/order" className="text-[#629D23] hover:text-[#2D3B29] transition-colors">
                <ArrowRight size={24} />
              </Link>
            </div>
            <div className="space-y-6">
              {data.recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#629D23] text-xs">
                    {order.user?.name?.charAt(0) || 'G'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#2D3B29] truncate">{order.user?.name || 'Guest'}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Order #{order.id.slice(0, 8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[#2D3B29]">Rs. {order.totalAmount.toLocaleString()}</p>
                    <p className={`text-[10px] font-bold uppercase ${order.status === 'Delivered' ? 'text-green-500' : 'text-orange-500'}`}>
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}