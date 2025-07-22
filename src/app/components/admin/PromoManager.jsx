"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import ConfirmationDialog from "./ConfirmationDialog";

export default function PromoManager() {
  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deletePromoId, setDeletePromoId] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    minOrderAmount: 0,
  });

  useEffect(() => {
    fetchPromos();
  }, []);

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/promocode", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to fetch promo codes");
      }
      
      const data = await response.json();
      setPromos(data.promoCodes);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast.error(error.message || "Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }
      
      const response = await fetch("/api/promocode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create promo code");
      }
      
      toast.success("Promo code created successfully!");
      setFormData({
        code: "",
        discountPercentage: "",
        minOrderAmount: 0,
      });
      setShowForm(false);
      fetchPromos();
    } catch (error) {
      console.error("Error creating promo code:", error);
      toast.error(error.message || "Failed to create promo code");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const confirmDelete = (id) => {
    setDeletePromoId(id);
    setShowConfirmation(true);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("No authentication token found. Please log in.");
        return;
      }
      
      const response = await fetch(`/api/promocode?id=${deletePromoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to delete promo code");
      }
      
      toast.success("Promo code deleted successfully!");
      fetchPromos();
    } catch (error) {
      console.error("Error deleting promo code:", error);
      toast.error(error.message || "Failed to delete promo code");
    } finally {
      setShowConfirmation(false);
      setDeletePromoId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl text-black shadow-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Promo Codes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Cancel" : "Create New Promo"}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Create New Promo Code</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Promo Code*
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. SUMMER25"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage*
                </label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="100"
                  step="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 25"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Order Amount (Rs)
                </label>
                <input
                  type="number"
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 50"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Create Promo Code
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      ) : promos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No promo codes found. Create your first one!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount %
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Order Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promos.map((promo) => (
                <tr key={promo._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {promo.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {promo.discountPercentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Rs {promo.minOrderAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => confirmDelete(promo._id)}
                      className="text-red-600 hover:text-red-900 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this promo code?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
}