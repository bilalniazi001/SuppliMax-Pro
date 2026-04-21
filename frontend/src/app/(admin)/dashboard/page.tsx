'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react'; 

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition duration-300 hover:shadow-xl">
    <div className={`flex items-center justify-between p-3 rounded-full ${color} text-white w-12 h-12 mb-3`}>
      {icon}
    </div>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <div className="flex items-end justify-between">
      <h2 className="text-3xl font-bold text-gray-800 mt-1">{value}</h2>
      <span className={`text-xs font-semibold ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {trend}
      </span>
    </div>
  </div>
);

const DashboardStats = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    <StatCard 
      title="Total Revenue" 
      value="$45,231" 
      trend="+12.5%" 
      icon={<TrendingUp size={20} />} 
      color="bg-teal-600" 
    />
    <StatCard 
      title="New Orders" 
      value="1,350" 
      trend="+8.1%" 
      icon={<ShoppingCart size={20} />} 
      color="bg-indigo-600" 
    />
    <StatCard 
      title="Total Products" 
      value="345" 
      trend="+1.2%" 
      icon={<Package size={20} />} 
      color="bg-yellow-600" 
    />
    <StatCard 
      title="Active Users" 
      value="5,200" 
      trend="-0.5%" 
      icon={<Users size={20} />} 
      color="bg-red-600" 
    />
  </div>
);

const RecentOrders = () => {
  const dummyOrders = [
    { id: '#1001', customer: 'Ali Khan', total: 150.00, status: 'Completed' },
    { id: '#1002', customer: 'Sara Malik', total: 99.50, status: 'Processing' },
    { id: '#1003', customer: 'Imran Bhatti', total: 320.75, status: 'Cancelled' },
    { id: '#1004', customer: 'Hina Tariq', total: 55.00, status: 'Completed' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-teal-600">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.customer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-4">
        <Link href="/admin/orders" className="text-teal-600 hover:text-teal-800 text-sm font-medium">
          View All Orders &rarr;
        </Link>
      </div>
    </div>
  );
};

const ProductStock = () => {
    const dummyStock = [
        { name: 'Protein Powder (Vanilla)', stock: 15, color: 'text-red-600' },
        { name: 'Creatine Monohydrate', stock: 120, color: 'text-green-600' },
        { name: 'BCAA Supplement', stock: 45, color: 'text-yellow-600' },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Stock Status</h2>
            <ul className="space-y-4">
                {dummyStock.map((item, index) => (
                    <li key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                        <span className="text-gray-700 font-medium">{item.name}</span>
                        <span className={`font-bold ${item.color}`}>
                            {item.stock} in Stock
                        </span>
                    </li>
                ))}
            </ul>
             <div className="text-center mt-4">
                <Link href="/admin/products" className="text-teal-600 hover:text-teal-800 text-sm font-medium">
                    Manage Stock &rarr;
                </Link>
            </div>
        </div>
    );
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <RecentOrders />
        </div>
        
        <div className="lg:col-span-1">
            <ProductStock />
        </div>
      </div>
      
    </div>
  );
}