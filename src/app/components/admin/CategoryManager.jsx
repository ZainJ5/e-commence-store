"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationDialog from "./ConfirmationDialog";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error('Failed to fetch categories. Please try again.', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty.', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
      return;
    }

    setLoading(true);
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
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (res.ok) {
        setNewCategory("");
        await fetchCategories();
        toast.success('Category added successfully!', {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error(error.message || 'Failed to add category.', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    const category = categories.find(c => c._id === id);
    setCategoryToDelete(category);
    setShowConfirmation(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

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
      const res = await fetch(`/api/categories/${categoryToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchCategories();
        toast.success('Category deleted successfully!', {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.message || 'Failed to delete category.', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    } finally {
      setCategoryToDelete(null);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <Toaster />
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="border border-gray-300 px-4 text-black py-2 rounded-lg w-full"
          disabled={loading}
        />
        <button
          onClick={addCategory}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {categories.map((cat) => (
          <li key={cat._id} className="flex justify-between items-center py-2">
            <span className="text-gray-800">{cat.name}</span>
            <button
              onClick={() => deleteCategory(cat._id)}
              className="text-red-500 hover:text-red-700 text-sm"
              disabled={loading}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {showConfirmation && (
        <ConfirmationDialog
          message={`Are you sure you want to delete "${categoryToDelete?.name}"?`}
          onConfirm={confirmDeleteCategory}
          onCancel={() => {
            setShowConfirmation(false);
            setCategoryToDelete(null);
          }}
        />
      )}
    </div>
  );
}