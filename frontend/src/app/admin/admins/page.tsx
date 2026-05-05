'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '@/config';
import { User, Mail, Shield, Calendar, Phone, Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  createdAt: string;
}

export default function AdminAdminsPage() {
  const [admins, setAdmins] = useState<AdminData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/admins`);
      const data = await res.json();
      setAdmins(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({ name: '', email: '', phone: '', password: '' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (admin: AdminData) => {
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone || '',
      password: '', // Password stays empty unless changing
    });
    setCurrentAdminId(admin.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `${API_BASE_URL}/users/${currentAdminId}` 
        : `${API_BASE_URL}/auth/register`; // Use registration for new admin
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      // If adding new admin, set role to admin
      const bodyData = isEditing 
        ? { ...formData } 
        : { ...formData, role: 'admin' };
      
      // Remove empty password on edit
      if (isEditing && !formData.password) {
        delete (bodyData as any).password;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchAdmins();
      } else {
        const err = await res.json();
        alert(`Error: ${err.message || 'Action failed'}`);
      }
    } catch (err) {
      console.error('Submit failed:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) fetchAdmins();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loading && admins.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#629D23]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#2D3B29]">Admin Management</h1>
          <p className="text-gray-500 mt-1">Add and manage administrative accounts for your platform</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center justify-center bg-[#629D23] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#2D3B29] transition-all transform hover:-translate-y-1 active:scale-95"
        >
          <Plus size={20} className="mr-2" />
          Add New Admin
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-[#2D3B29]">Admin User</th>
                <th className="p-4 font-bold text-[#2D3B29]">Contact Information</th>
                <th className="p-4 font-bold text-[#2D3B29]">Joined Date</th>
                <th className="p-4 font-bold text-[#2D3B29] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-gray-500 italic">
                    No administrative accounts found.
                  </td>
                </tr>
              ) : (
                admins.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#E8F3DE] rounded-2xl flex items-center justify-center text-[#629D23] shadow-sm">
                          <Shield size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{u.name}</p>
                          <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold uppercase">
                            Admin
                          </span>
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
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-2" />
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button 
                          onClick={() => handleOpenEditModal(u)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Admin"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(u.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Admin"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="bg-[#629D23] p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{isEditing ? 'Edit Admin' : 'Add New Admin'}</h2>
                <p className="text-green-100 text-sm">Enter the details for the admin account</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2D3B29] ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. John Doe"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#629D23] focus:ring-0 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2D3B29] ml-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@supplimax.com"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#629D23] focus:ring-0 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2D3B29] ml-1">Phone Number</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="+92 300 1234567"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#629D23] focus:ring-0 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#2D3B29] ml-1">
                  Password {isEditing && <span className="text-gray-400 text-xs font-normal">(Leave blank to keep current)</span>}
                </label>
                <input 
                  required={!isEditing}
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 focus:border-[#629D23] focus:ring-0 outline-none transition-all text-gray-900 font-medium placeholder-gray-400 bg-gray-50"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-2.5 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-[#629D23] text-white px-6 py-2.5 rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-[#2D3B29] hover:shadow-none transition-all flex items-center justify-center active:scale-95"
                >
                  {isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
