"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiLayout, FiPackage, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';
import { AiOutlineShoppingCart, AiOutlineDollar, AiOutlineCodeSandbox } from "react-icons/ai";
import { BiBuoy, BiMessageAltDetail } from "react-icons/bi";

const navItems = [
  { href: '/dashboard', icon: FiLayout, label: 'Dashboard' },
  { href: '/products', icon: FiPackage, label: 'Products' },
  { href: '/admin/users', icon: FiUsers, label: 'Users' },
  { href: '/admin/settings', icon: FiSettings, label: 'Settings' },
  { href: '/admin/order', icon: AiOutlineShoppingCart, label: 'Order' },
  { href: '/admin/brand', icon: BiBuoy, label: 'Brand' },
  { href: '/admin/transaction', icon: AiOutlineDollar, label: 'Transaction' },
  { href: '/admin/vendor', icon: AiOutlineCodeSandbox, label: 'Vendor' },
  { href: '/admin/review', icon: BiMessageAltDetail, label: 'Review' },
];

const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex flex-col w-[273px] bg-white text-[#2D3B29] h-screen py-4 px-0 border-r border-[#e2e2e2] overflow-y-auto">
      
      <div className="px-6 pb-3 border-b border-[#e2e2e2]">
        <h2 className="text-3xl font-extrabold tracking-wider text-[#629D23]">
          SuppliMax
        </h2>
        {user && (
          <div className="mt-2 text-sm text-gray-600">
            <p className="font-semibold">{user.name}</p>
            <p className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block mt-1">
              {user.role}
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} passHref>
              <div
                className={`
                  flex items-center p-3 font-medium transition-all duration-300 cursor-pointer rounded-lg
                  ${
                    isActive
                      ? 'bg-[#629D23] shadow-lg text-white transform translate-x-1' 
                      : 'text-[#2D3B29] hover:bg-[#629D23] hover:text-white' 
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e2e2e2]">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 text-white bg-[#629D23] hover:bg-[#2D3B29] rounded-lg transition-colors duration-300"
        >
          <FiLogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;