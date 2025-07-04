'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import AdminPortal from '../components/AdminPortal';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    router.push('/admin/login');
  };

  return (
    <div>
      <div className="flex justify-end text-black p-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
      <AdminPortal />
    </div>
  );
}