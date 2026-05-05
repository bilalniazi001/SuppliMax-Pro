'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';
import { User, Mail, Shield, Calendar, Phone, MapPin } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  age: number;
  phone: string;
  city: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/users`)
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch users:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#629D23]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-[#2D3B29]">Registered Users</h1>
          <p className="text-gray-500 mt-1">Manage and view all registered customers and staff</p>
        </div>
        <div className="bg-[#629D23] text-white px-4 py-2 rounded-lg font-bold shadow-lg">
          Total: {users.length}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 font-bold text-[#2D3B29]">User</th>
                  <th className="p-4 font-bold text-[#2D3B29]">Contact</th>
                  <th className="p-4 font-bold text-[#2D3B29]">Role</th>
                  <th className="p-4 font-bold text-[#2D3B29]">Location</th>
                  <th className="p-4 font-bold text-[#2D3B29]">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#E8F3DE] rounded-full flex items-center justify-center text-[#629D23]">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <p className="text-xs text-gray-400">ID: {u.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          {u.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {u.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={14} className="mr-2 text-gray-400" />
                        {u.city || 'N/A'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-2" />
                        {new Date(u.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
