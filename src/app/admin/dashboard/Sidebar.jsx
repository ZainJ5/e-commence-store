'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiPackage, FiHome, FiUsers, FiSettings, FiLogOut } from 'react-icons/fi';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: FiHome,
    },
    {
      name: 'Products',
      href: '/dashboard/products',
      icon: FiPackage,
    },
    {
      name: 'Customers',
      href: '/dashboard/customers',
      icon: FiUsers,
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: FiSettings,
    },
  ];

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/admin');
  };

  return (
    <div className="bg-white h-full border-r border-gray-200 min-h-screen">
      <div className="py-6 px-4">
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-2xl font-bold text-emerald-800">Admin Portal</h1>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${
                isActive(item.href)
                  ? 'bg-emerald-800 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              } group flex items-center px-4 py-2 text-sm font-medium rounded-md w-full`}
            >
              <item.icon
                className={`${
                  isActive(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                } flex-shrink-0 h-5 w-5 mr-3`}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="px-4 absolute bottom-4 w-full">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
        >
          <FiLogOut className="text-gray-500 flex-shrink-0 h-5 w-5 mr-3" />
          Log out
        </button>
      </div>
    </div>
  );
}