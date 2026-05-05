'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';
import { ShoppingBag, Truck, CheckCircle, Clock, Search, MoreVertical } from 'lucide-react';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    name: string;
    imageUrl: string;
  };
}

interface OrderData {
  id: string;
  totalAmount: number;
  status: string;
  address: string;
  phone: string;
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch(`${API_BASE_URL}/orders`)
      .then(res => res.json())
      .then(result => {
        const ordersArray = Array.isArray(result) ? result : (result.value || []);
        setOrders(ordersArray);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error('Update status failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#629D23]"></div>
      </div>
    );
  }

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#2D3B29]">Order Management</h1>
          <p className="text-gray-500 mt-1">Track and update customer orders in real-time</p>
        </div>
        
        <div className="flex bg-white rounded-xl shadow-sm p-1 border border-gray-100">
          {['All', 'Not Shipped', 'Shipped', 'Delivered'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === s ? 'bg-[#629D23] text-white' : 'text-gray-500 hover:text-[#629D23]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-gray-200">
            <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No orders found matching your filter.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#E8F3DE] rounded-full flex items-center justify-center text-[#629D23]">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#2D3B29]">Order #{order.id.slice(0, 8)}</h3>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-[#629D23]">Customer: {order.user?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Amount</p>
                    <p className="text-2xl font-black text-[#2D3B29]">Rs. {order.totalAmount.toLocaleString()}</p>
                  </div>
                  
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold border-none focus:ring-2 focus:ring-[#629D23] transition-colors ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}
                  >
                    <option value="Not Shipped">Not Shipped</option>
                    <option value="Shipped">Shipped</option>
                    <option value="On the way">On the way</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              <div className="p-6 bg-gray-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Delivery Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-start text-[#2D3B29]">
                        <Truck size={16} className="mr-3 mt-1 text-[#629D23]" />
                        <p className="text-sm">{order.address}</p>
                      </div>
                      <div className="flex items-center text-[#2D3B29]">
                        <Clock size={16} className="mr-3 text-[#629D23]" />
                        <p className="text-sm">Phone: {order.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Items ({order.items.length})</h4>
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={item.product?.imageUrl || 'https://via.placeholder.com/50'} 
                              alt={item.product?.name}
                              className="w-10 h-10 object-cover rounded-lg shadow-sm"
                            />
                            <div>
                              <p className="text-sm font-bold text-[#2D3B29]">{item.product?.name || 'Unknown Product'}</p>
                              <p className="text-xs font-bold text-gray-500">Qty: {item.quantity} × <span className="text-[#629D23]">Rs. {item.price.toLocaleString()}</span></p>
                            </div>
                          </div>
                          <p className="text-base font-black text-[#2D3B29]">Rs. {(item.quantity * item.price).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
