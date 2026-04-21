"use client";

import { useAuth } from '@/context/AuthContext';

const AdminTopBar = () => {
  const { user, logout } = useAuth();

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex items-center justify-between h-16 bg-white px-6 sticky top-0 z-40 border-b border-gray-200 shadow-sm">
      
      <div className="relative w-96">
        <input
          type="text"
          placeholder="Search items, orders, or users..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#629D23]/40 focus:border-[#629D23]/40"
        />
        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      
      <div className="flex items-center space-x-4">
        
        <button className="text-[#2D3B29] hover:text-[#629D23] relative">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0m6 0H9"></path>
          </svg>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
        </button>
        
        <div className="flex items-center cursor-pointer p-1 rounded-full hover:bg-gray-100 transition duration-150">
          <div className="w-10 h-10 bg-[#629D23] rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user ? getUserInitials(user.name) : 'AU'}
          </div>
          <div className="ml-2 text-sm font-medium text-[#2D3B29] hidden md:inline">
            {user ? user.name : 'Admin User'}
            <div className="text-xs text-green-600 font-normal">
              {user?.role === 'admin' ? 'Administrator' : 'User'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopBar;