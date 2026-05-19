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
    <div className="p-4 sm:p-6 md:p-10 space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#2D3B29]">Registered Users</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view all registered customers and staff</p>
        </div>
        <div className="bg-[#629D23] text-white px-4 py-2 rounded-lg font-bold shadow-lg self-start sm:self-auto">
          Total: {users.length}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
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

          {/* Mobile Card Grid View */}
          <div className="grid grid-cols-1 gap-4 md:hidden p-4 bg-white">
            {users.map((u) => (
              <div key={u.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#E8F3DE] rounded-full flex items-center justify-center text-[#629D23] flex-shrink-0">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{u.name}</p>
                    <p className="text-[10px] text-gray-400">ID: {u.id.slice(0, 8)}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {u.role}
                  </span>
                </div>

                <div className="pt-2.5 border-t border-gray-200/60 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <Mail size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                    <span>{u.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2 text-gray-400 flex-shrink-0" />
                      <span>{u.city || 'N/A'}</span>
                    </div>
                    <div className="flex items-center text-gray-400 font-medium">
                      <Calendar size={14} className="mr-1.5 flex-shrink-0" />
                      <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
