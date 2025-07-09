"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';
import Products from "./Products";
import ProductFormModal from "./ProductFormModal";
import ConfirmationDialog from "./ConfirmationDialog";
import CategoryManager from "./CategoryManager";
import TypeManager from "./TypeManager";

export default function AdminPortal() {
  const [activeTab, setActiveTab] = useState("allProducts");
  const [siteStatus, setSiteStatus] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error('No authentication token found. Please log in.', {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
        return;
      }

      try {
        const res = await fetch("/api/site-status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setSiteStatus(data.isSiteActive);
        } else {
          console.error("Failed to fetch site status:", data.error);
          toast.error(data.error || 'Failed to fetch site status.', {
            position: 'top-right',
            style: {
              background: '#FEE2E2',
              color: '#991B1B',
              border: '1px solid #EF4444',
            },
          });
        }
      } catch (error) {
        console.error("Error fetching site status:", error);
        toast.error('An error occurred while fetching site status.', {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      }
    };

    fetchStatus();
  }, []);

  const handleToggleSiteStatus = () => {
    setShowConfirmation(true);
  };

  const toggleSiteStatus = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error('No authentication token found. Please log in.', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
      setShowConfirmation(false);
      return;
    }

    try {
      const newStatus = !siteStatus;
      const res = await fetch("/api/site-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isSiteActive: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setSiteStatus(newStatus);
        toast.success(`Store is now ${newStatus ? 'Online' : 'Offline'}!`, {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      } else {
        console.error("Failed to update site status:", data.error);
        toast.error(data.error || 'Failed to update site status.', {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      }
    } catch (error) {
      console.error("Error updating site status:", error);
      toast.error('An error occurred while updating site status.', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    } finally {
      setShowConfirmation(false);
    }
  };

  const menuItems = [
    {
      id: "allProducts",
      label: "All Products",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      id: "addProducts",
      label: "Add Products",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
    },
    {
      id: "manageCategories",
      label: "Manage Categories",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      ),
    },
    {
      id: "manageTypes",
      label: "Manage Types",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10m0 0l-4-4m4 4l-4 4M3 17h10m0 0l-4-4m4 4l-4 4" />
        </svg>
      ),
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "allProducts":
        return <Products />;
      case "addProducts":
        return (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <ProductFormModal onCancel={() => setActiveTab("allProducts")} />
          </div>
        );
      case "manageCategories":
        return <CategoryManager />;
      case "manageTypes":
        return <TypeManager />;
      default:
        return <Products />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 sm:p-8 lg:p-10">
      <Toaster />
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl flex flex-col md:flex-row h-[90vh] overflow-hidden">
        {/* Sidebar */}
        <div
          className="hidden md:block w-full md:w-64 bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6"
          style={{
            overflowY: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.jpg"
              alt="ShahBazar Logo"
              width={100}
              height={100}
              className="object-contain rounded-full drop-shadow-lg"
              priority
            />
          </div>
          <h2 className="text-xl font-bold mb-6 text-center text-gray-200 tracking-wide">
            Admin Dashboard
          </h2>

          <button
            onClick={handleToggleSiteStatus}
            className={`w-full text-left px-4 py-3 mb-8 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between ${siteStatus
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
              }`}
          >
            <span className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {siteStatus ? "Store is Online" : "Store is Offline"}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${siteStatus ? "bg-blue-300" : "bg-red-300"}`}>
              {siteStatus ? "ON" : "OFF"}
            </span>
          </button>

          <div>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center ${activeTab === item.id
                        ? "bg-gray-700 bg-opacity-80 shadow-md transform translate-x-1 border-l-4 border-white"
                        : "hover:bg-gray-600 hover:bg-opacity-50"
                      }`}
                  >
                    <span
                      className={`mr-3 transition-transform duration-300 ${activeTab === item.id ? "rotate-90" : ""}`}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 sm:p-8 overflow-y-auto bg-white rounded-r-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">
              {menuItems.find((item) => item.id === activeTab)?.label}
            </h1>
            <div className="text-xs sm:text-sm text-gray-600 font-medium bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-300">
              {new Date().toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>

          {renderContent()}
        </div>
      </div>

      {showConfirmation && (
        <ConfirmationDialog
          message={`Are you sure you want to turn the store ${siteStatus ? "OFF" : "ON"}?`}
          onConfirm={toggleSiteStatus}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}