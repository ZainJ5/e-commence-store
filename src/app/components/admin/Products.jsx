"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';
import ProductFormModal from "./ProductFormModal";
import ConfirmationDialog from "./ConfirmationDialog";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    type: "",
    status: "",
  });
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);

  // Fetch products and categories/types on mount
  useEffect(() => {
    fetchProducts();
    fetchCategoriesAndTypes();
  }, []);

  // Apply filters whenever products or filters change
  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  // Fetch all products from API
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error('Failed to fetch products. Please try again.', {
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

  // Fetch categories and types from APIs
  const fetchCategoriesAndTypes = async () => {
    try {
      const [catRes, typeRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/type"),
      ]);

      if (!catRes.ok) throw new Error(`HTTP error fetching categories! Status: ${catRes.status}`);
      if (!typeRes.ok) throw new Error(`HTTP error fetching types! Status: ${typeRes.status}`);

      const categoriesData = await catRes.json();
      const typesData = await typeRes.json();

      // Ensure categories and types are arrays
      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || []);
      setTypes(Array.isArray(typesData.types) ? typesData.types : []);
    } catch (error) {
      console.error("Error fetching categories or types:", error);
      toast.error('Failed to fetch categories or types. Please try again.', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    }
  };

  // Apply filters to product list
  const applyFilters = () => {
    let filtered = [...products];

    if (filters.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (product) =>
          product.category?._id === filters.category ||
          product.category === filters.category
      );
    }

    if (filters.type) {
      filtered = filtered.filter(
        (product) =>
          product.type?._id === filters.type || product.type === filters.type
      );
    }

    if (filters.status) {
      filtered = filtered.filter(
        (product) => product.isActive === (filters.status === "active")
      );
    }

    setFilteredProducts(filtered);
  };

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (product) => {
    setProductToDelete(product);
    setShowConfirmation(true);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/products/${productToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p._id !== productToDelete._id));
        toast.success('Product deleted successfully!', {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message || 'An error occurred while deleting the product', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    } finally {
      setProductToDelete(null);
      setShowConfirmation(false);
    }
  };

  const toggleProductStatus = async (product) => {
    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      formData.append("id", product._id);
      formData.append("name", product.name);
      formData.append("description", product.description || "");
      formData.append("originalPrice", product.originalPrice);
      formData.append("discountedPrice", product.discountedPrice || "");
      formData.append("category", product.category._id || product.category);
      formData.append("type", product.type._id || product.type);
      formData.append("size", JSON.stringify(product.size || []));
      formData.append(
        "color",
        JSON.stringify(Array.isArray(product.color) ? product.color : [product.color || ""])
      );
      formData.append("gender", product.gender || "unisex");
      formData.append("stock", product.stock);
      formData.append("isActive", (!product.isActive).toString());
      formData.append("productTags", JSON.stringify(product.productTags || []));

      if (product.images && product.images.length > 0) {
        formData.append("existingImages", JSON.stringify(product.images));
      }

      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const updatedData = await res.json();
        setProducts(
          products.map((p) =>
            p._id === product._id ? { ...p, isActive: !p.isActive } : p
          )
        );
        toast.success(`Product ${!product.isActive ? "activated" : "deactivated"} successfully!`, {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
      toast.error(error.message || 'An error occurred while updating the product status', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    }
  };

  const handleSubmitProduct = async (productData) => {
    try {
      await fetchProducts();
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error after product update:", error);
      toast.error('An error occurred while refreshing product list', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    }
  };

  const formatProductTags = (tags) => {
    if (!tags || tags.length === 0) return "No tags";
    const tagLabels = {
      "new-arrival": "New Arrival",
      featured: "Featured",
      "mr-shah-collection": "Mr. Shah Collection",
    };
    return tags.map((tag) => tagLabels[tag] || tag).join(", ");
  };

  const formatSizes = (sizes) => {
    if (!sizes || sizes.length === 0) return "One Size";
    return sizes.filter((size) => size.trim() !== "").join(", ");
  };

  const formatColors = (colors) => {
    if (!colors || colors.length === 0) return "No Color";
    return colors.filter((color) => color.trim() !== "").join(", ");
  };

  return (
    <div className="bg-gray-50 h-fit">
      <Toaster />
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
        {/* Filters and Product Count */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
            <div className="text-sm font-semibold text-indigo-600 text-center bg-indigo-50 px-4 py-2 rounded-full">
              Total Products: {filteredProducts.length}
            </div>
            <div className="w-full sm:w-auto grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name..."
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 transition-colors duration-200"
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 bg-white transition-colors duration-200"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 bg-white transition-colors duration-200"
                >
                  <option value="">All Types</option>
                  {types.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm py-2 px-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 bg-white transition-colors duration-200"
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-600">Try adjusting the filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Stock
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Tags
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative">
                          <Image
                            src={
                              product.images && product.images.length > 0
                                ? product.images[0]
                                : "/placeholder.jpg"
                            }
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-md object-cover"
                            onError={(e) => {
                              e.target.src = "/placeholder.jpg";
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.gender} • {formatSizes(product.size)} •{" "}
                            {formatColors(product.color)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Rs {product.originalPrice?.toLocaleString() || 0}
                      </div>
                      {product.discountedPrice && (
                        <div className="text-sm text-indigo-600">
                          Rs {product.discountedPrice.toLocaleString()} (Sale)
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.category?.name ||
                        (typeof product.category === "string"
                          ? product.category
                          : "Uncategorized")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.type?.name ||
                        (typeof product.type === "string" ? product.type : "No Type")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatProductTags(product.productTags)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleProductStatus(product)}
                        className={`mr-3 ${
                          product.isActive
                            ? "text-orange-600 hover:text-orange-700"
                            : "text-indigo-600 hover:text-indigo-700"
                        } transition-colors duration-200`}
                      >
                        {product.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="text-indigo-600 hover:text-indigo-700 mr-3 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-700 transition-colors duration-200"
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

        {isModalOpen && (
          <ProductFormModal
            product={selectedProduct}
            onSubmit={handleSubmitProduct}
            onCancel={() => {
              setIsModalOpen(false);
              setSelectedProduct(null);
            }}
          />
        )}

        {showConfirmation && (
          <ConfirmationDialog
            message={`Are you sure you want to delete "${productToDelete?.name}"?`}
            onConfirm={confirmDeleteProduct}
            onCancel={() => {
              setShowConfirmation(false);
              setProductToDelete(null);
            }}
          />
        )}
      </div>
    </div>
  );
}