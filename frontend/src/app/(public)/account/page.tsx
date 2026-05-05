'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Hash, Lock, Trash2, Edit3, X, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AccountPage() {
  const { user, isAuthenticated, loading, updateProfile, deleteAccount, changePassword } = useAuth();
  const router = useRouter();

  // Modal States
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({
    name: '',
    age: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    nationality: '',
    cnic: ''
  });

  // Password Change State
  const [passForm, setPassForm] = useState({
    cnic: '',
    phone: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
    if (user) {
      setEditForm({
        name: user.name || '',
        age: user.age?.toString() || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        postalCode: user.postalCode || '',
        nationality: user.nationality || '',
        cnic: user.cnic || ''
      });
    }
  }, [loading, isAuthenticated, router, user]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    setErrorMsg('');
    const success = await updateProfile({
      ...editForm,
      age: parseInt(editForm.age) || undefined
    });
    if (success) {
      setSuccessMsg('Profile updated successfully!');
      setShowEditModal(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setErrorMsg('Failed to update profile.');
    }
    setActionLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      setErrorMsg('Passwords do not match');
      return;
    }
    setActionLoading(true);
    setErrorMsg('');
    const result = await changePassword(passForm.cnic, passForm.phone, passForm.newPassword);
    if (result.success) {
      setSuccessMsg(result.message);
      setShowPasswordModal(false);
      setPassForm({ cnic: '', phone: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMsg(''), 3000);
    } else {
      setErrorMsg(result.message);
    }
    setActionLoading(false);
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm("Do you want to delete this account. This action cannot be undo once you click Delete");
    if (confirm) {
      setActionLoading(true);
      const success = await deleteAccount();
      if (success) {
        router.push('/');
      } else {
        alert('Failed to delete account');
      }
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#629D23]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Success/Error Toasts */}
        {successMsg && (
          <div className="fixed top-24 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center animate-in slide-in-from-right duration-300">
            <CheckCircle className="mr-2" size={20} />
            {successMsg}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
              <div className="w-32 h-32 bg-gradient-to-br from-[#629D23] to-[#2D3B29] rounded-full flex items-center justify-center text-4xl font-black text-white mx-auto mb-6 shadow-2xl ring-4 ring-green-50">
                {user.name?.[0].toUpperCase()}
              </div>
              <h2 className="text-2xl font-black text-[#2D3B29]">{user.name}</h2>
              <p className="text-[#629D23] font-medium text-sm mb-4">{user.email}</p>
              <div className="inline-block bg-green-50 text-[#629D23] px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                {user.role}
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
                <button 
                  onClick={() => setShowEditModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#629D23] hover:bg-[#2D3B29] text-white py-3 rounded-xl font-bold transition-all transform hover:scale-[1.02]"
                >
                  <Edit3 size={18} /> Edit Profile
                </button>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-100 hover:border-[#629D23] text-gray-700 py-3 rounded-xl font-bold transition-all"
                >
                  <Lock size={18} /> Change Password
                </button>
                <button 
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-700 font-bold py-2 transition-all mt-4"
                >
                  <Trash2 size={18} /> Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Main Info */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-[#2D3B29]">Personal Information</h3>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last Updated: Just now</span>
              </div>
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { label: 'Full Name', value: user.name, icon: User },
                  { label: 'Age', value: user.age ? `${user.age} Years` : 'Not Provided', icon: Calendar },
                  { label: 'Phone', value: user.phone, icon: Phone },
                  { label: 'CNIC', value: user.cnic, icon: Hash },
                  { label: 'Nationality', value: user.nationality, icon: MapPin },
                  { label: 'City', value: user.city, icon: MapPin },
                  { label: 'Country', value: user.country, icon: MapPin },
                  { label: 'Postal Code', value: user.postalCode, icon: Hash },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{item.label}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-[#629D23]">
                        <item.icon size={16} />
                      </div>
                      <p className="font-bold text-[#2D3B29]">{item.value || 'Not Provided'}</p>
                    </div>
                  </div>
                ))}
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Complete Address</span>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-[#629D23] flex-shrink-0">
                      <MapPin size={16} />
                    </div>
                    <p className="font-bold text-[#2D3B29] leading-relaxed">{user.address || 'Not Provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-black text-[#2D3B29]">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold text-[#2D3B29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Age</label>
                  <input 
                    type="number" 
                    value={editForm.age}
                    onChange={(e) => setEditForm({...editForm, age: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold text-[#2D3B29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Phone</label>
                  <input 
                    type="text" 
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold text-[#2D3B29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">CNIC</label>
                  <input 
                    type="text" 
                    value={editForm.cnic}
                    onChange={(e) => setEditForm({...editForm, cnic: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold text-[#2D3B29]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Complete Address</label>
                  <input 
                    type="text" 
                    value={editForm.address}
                    onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold text-[#2D3B29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">City</label>
                  <input 
                    type="text" 
                    value={editForm.city}
                    onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold text-[#2D3B29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Country</label>
                  <input 
                    type="text" 
                    value={editForm.country}
                    onChange={(e) => setEditForm({...editForm, country: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold text-[#2D3B29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nationality</label>
                  <input 
                    type="text" 
                    value={editForm.nationality}
                    onChange={(e) => setEditForm({...editForm, nationality: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold text-[#2D3B29]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Postal Code</label>
                  <input 
                    type="text" 
                    value={editForm.postalCode}
                    onChange={(e) => setEditForm({...editForm, postalCode: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold text-[#2D3B29]"
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={actionLoading}
                className="w-full bg-[#629D23] hover:bg-[#2D3B29] text-white py-4 rounded-xl font-black transition-all shadow-lg"
              >
                {actionLoading ? 'Updating...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-black text-[#2D3B29]">Change Password</h2>
              <button onClick={() => setShowPasswordModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-8 space-y-6">
              <div className="bg-orange-50 p-4 rounded-xl flex gap-3 items-start border border-orange-100">
                <AlertTriangle className="text-orange-500 flex-shrink-0" size={18} />
                <p className="text-xs text-orange-700 font-medium leading-relaxed">
                  For security, please verify your CNIC and Phone number used during registration to change your password.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Verify CNIC</label>
                  <input 
                    type="text" 
                    required
                    value={passForm.cnic}
                    onChange={(e) => setPassForm({...passForm, cnic: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold"
                    placeholder="Enter CNIC"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Verify Phone</label>
                  <input 
                    type="text" 
                    required
                    value={passForm.phone}
                    onChange={(e) => setPassForm({...passForm, phone: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold"
                    placeholder="Enter Phone Number"
                  />
                </div>
                <div className="border-t pt-4 mt-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">New Password</label>
                  <input 
                    type="password" 
                    required
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({...passForm, newPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    required
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm({...passForm, confirmPassword: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#629D23] outline-none font-bold"
                  />
                </div>
              </div>
              {errorMsg && <p className="text-red-500 text-xs font-bold">{errorMsg}</p>}
              <button 
                type="submit" 
                disabled={actionLoading}
                className="w-full bg-[#2D3B29] hover:bg-black text-white py-4 rounded-xl font-black transition-all shadow-lg"
              >
                {actionLoading ? 'Verifying...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}