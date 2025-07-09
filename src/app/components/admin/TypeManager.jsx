"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import ConfirmationDialog from "./ConfirmationDialog";

export default function TypeManager() {
  const [types, setTypes] = useState([]);
  const [newType, setNewType] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const res = await fetch("/api/type");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setTypes(data.types || []);
    } catch (error) {
      console.error("Error fetching types:", error);
      toast.error('Failed to fetch types. Please try again.', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    }
  };

  const addType = async () => {
    if (!newType.trim()) {
      toast.error('Type name cannot be empty.', {
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
      const res = await fetch("/api/type", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newType }),
      });

      if (res.ok) {
        setNewType("");
        await fetchTypes();
        toast.success('Type added successfully!', {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add type");
      }
    } catch (error) {
      console.error("Error adding type:", error);
      toast.error(error.message || 'Failed to add type.', {
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

  const deleteType = async (id) => {
    const type = types.find(t => t._id === id);
    setTypeToDelete(type);
    setShowConfirmation(true);
  };

  const confirmDeleteType = async () => {
    if (!typeToDelete) return;

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
      const res = await fetch(`/api/type/${typeToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchTypes();
        toast.success('Type deleted successfully!', {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete type");
      }
    } catch (error) {
      console.error("Error deleting type:", error);
      toast.error(error.message || 'Failed to delete type.', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    } finally {
      setTypeToDelete(null);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
      <Toaster />
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
          placeholder="New type name"
          className="border border-gray-300 px-4 text-black py-2 rounded-lg w-full"
          disabled={loading}
        />
        <button
          onClick={addType}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      <ul className="divide-y divide-gray-200">
        {types.map((type) => (
          <li key={type._id} className="flex justify-between items-center py-2">
            <span className="text-gray-800">{type.name}</span>
            <button
              onClick={() => deleteType(type._id)}
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
          message={`Are you sure you want to delete "${typeToDelete?.name}"?`}
          onConfirm={confirmDeleteType}
          onCancel={() => {
            setShowConfirmation(false);
            setTypeToDelete(null);
          }}
        />
      )}
    </div>
  );
}