"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Product Form Popup Component
const ProductFormModal = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    category: "",
    size: [],
    color: [],
    gender: "unisex",
    stock: "",
    image: null,
    isActive: true
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        originalPrice: product.originalPrice || "",
        discountedPrice: product.discountedPrice || "",
        category: product.category || "",
        size: product.size || [],
        color: product.color || [],
        gender: product.gender || "unisex",
        stock: product.stock || "",
        isActive: product.isActive !== false
      });
      
      if (product.image) {
        setImagePreview(product.image);
      }
    }
  }, [product]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e, field) => {
    const { value, checked } = e.target;
    
    setFormData((prev) => {
      if (checked) {
        return { ...prev, [field]: [...prev[field], value] };
      } else {
        return { ...prev, [field]: prev[field].filter(item => item !== value) };
      }
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const submitFormData = new FormData();
    
    Object.keys(formData).forEach(key => {
      if (key === 'image' && formData.image) {
        submitFormData.append('image', formData.image);
      } else if (key === 'size' || key === 'color') {
        submitFormData.append(key, JSON.stringify(formData[key]));
      } else {
        submitFormData.append(key, formData[key]);
      }
    });
    
    onSubmit(submitFormData);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Original Price*</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Discounted Price</label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="tshirts">T-shirts</option>
                  <option value="shirts">Shirts</option>
                  <option value="pants">Pants</option>
                  <option value="jackets">Jackets</option>
                  <option value="dresses">Dresses</option>
                  <option value="shoes">Shoes</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock*</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <label key={size} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={size}
                        checked={formData.size.includes(size)}
                        onChange={(e) => handleCheckboxChange(e, "size")}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-1 text-sm">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Colors</label>
                <div className="flex flex-wrap gap-2">
                  {["Black", "White", "Red", "Blue", "Green", "Gray"].map((color) => (
                    <label key={color} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={color}
                        checked={formData.color.includes(color)}
                        onChange={(e) => handleCheckboxChange(e, "color")}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-1 text-sm">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Image*</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1 w-full"
                  {...(!product && { required: true })}
                />
                {imagePreview && (
                  <div className="mt-2 relative w-32 h-32 border rounded-md overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Active (Available for sale)
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Confirmation Dialog
const ConfirmationDialog = ({ message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-auto shadow-xl">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{message}</h3>
      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

export default function AdminPortal() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [siteStatus, setSiteStatus] = useState(true);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
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
      const res = await fetch(`/api/products/${productToDelete._id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        setProducts(products.filter(p => p._id !== productToDelete._id));
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setProductToDelete(null);
      setShowConfirmation(false);
    }
  };

  const toggleProductStatus = async (product) => {
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
      
      if (res.ok) {
        setProducts(products.map(p => 
          p._id === product._id ? { ...p, isActive: !p.isActive } : p
        ));
      } else {
        console.error("Failed to update product status");
      }
    } catch (error) {
      console.error("Error updating product status:", error);
    }
  };

  const handleToggleSiteStatus = () => {
    setShowConfirmation(true);
  };

  const toggleSiteStatus = async () => {
    try {
      const newStatus = !siteStatus;
      const res = await fetch("/api/site-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSiteActive: newStatus }),
      });
      
      if (res.ok) {
        setSiteStatus(newStatus);
      } else {
        console.error("Failed to update site status");
      }
    } catch (error) {
      console.error("Error updating site status:", error);
    } finally {
      setShowConfirmation(false);
    }
  };

  const handleSubmitProduct = async (formData) => {
    try {
      if (selectedProduct) {
        // Update existing product
        const res = await fetch(`/api/products/${selectedProduct._id}`, {
          method: "PUT",
          body: formData,
        });
        
        if (res.ok) {
          const updatedProduct = await res.json();
          setProducts(products.map(p => 
            p._id === selectedProduct._id ? updatedProduct.product : p
          ));
        } else {
          console.error("Failed to update product");
        }
      } else {
        // Add new product
        const res = await fetch("/api/products", {
          method: "POST",
          body: formData,
        });
        
        if (res.ok) {
          const newProduct = await res.json();
          setProducts([newProduct.product, ...products]);
        } else {
          console.error("Failed to add product");
        }
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    } finally {
      setIsModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="min-h-screen text-black bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[92vh]">
        {/* Sidebar */}
        <div 
          className="hidden md:block w-full md:w-1/4 bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6" 
          style={{ 
            overflowY: 'auto',
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none', 
          }}
        >
          <div className="flex justify-center mb-8">
            <Image 
              src="/logo.png" 
              alt="Fashion Store Logo" 
              width={120} 
              height={120} 
              className="object-contain drop-shadow-md"
            />
          </div>
          <h2 className="text-xl font-semibold mb-6 text-center text-white">Admin Dashboard</h2>
          <button
            onClick={handleToggleSiteStatus}
            className={`w-full text-left px-4 py-3 mb-8 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between ${
              siteStatus 
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg" 
                : "bg-gradient-to-r from-red-700 to-red-800 hover:from-red-800 hover:to-red-900 shadow-lg"
            }`}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {siteStatus ? "Store is Online" : "Store is Offline"}
            </span>
            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
              {siteStatus ? "ON" : "OFF"}
            </span>
          </button>
          <div>
            <ul className="space-y-1.5">
              <li>
                <button
                  className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center bg-blue-800 bg-opacity-70 shadow-md transform translate-x-1 border-l-4 border-white"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-3 transition-transform duration-300 rotate-90"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  Products
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="block md:hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
          <div className="flex items-center justify-center mb-2">
            <Image 
              src="/logo.png" 
              alt="Fashion Store Logo" 
              width={60} 
              height={60} 
              className="object-contain drop-shadow-md"
            />
            <h2 className="text-lg font-semibold ml-2">Fashion Store Admin</h2>
          </div>
          <button
            onClick={handleToggleSiteStatus}
            className={`w-full text-center px-3 py-2 mb-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
              siteStatus 
                ? "bg-gradient-to-r from-green-500 to-green-600 shadow-md" 
                : "bg-gradient-to-r from-red-700 to-red-800 shadow-md"
            }`}
          >
            {siteStatus ? "Store is Online (ON)" : "Store is Offline (OFF)"}
          </button>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-3/4 p-4 overflow-y-auto bg-gray-50">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h1 className="text-2xl font-bold text-blue-600">Products</h1>
            <div className="text-sm text-gray-500 font-medium bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200">
              {new Date().toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Product
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
                <div className="mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add New Product
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 relative">
                              <Image
                                src={product.image || "/placeholder-product.jpg"}
                                alt={product.name}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-md"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">
                                {product.gender} • {product.size?.join(", ")}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${product.originalPrice}</div>
                          {product.discountedPrice && (
                            <div className="text-sm text-green-600">${product.discountedPrice} (Sale)</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category || "Uncategorized"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.stock || 0}
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
                                ? "text-orange-600 hover:text-orange-800" 
                                : "text-green-600 hover:text-green-800"
                            }`}
                          >
                            {product.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="text-red-600 hover:text-red-800"
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
          </div>
        </div>
      </div>
      
      {/* Product Form Modal */}
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
      
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <ConfirmationDialog 
          message={
            productToDelete
              ? `Are you sure you want to delete "${productToDelete.name}"?`
              : `Are you sure you want to turn the store ${siteStatus ? 'OFF' : 'ON'}?`
          }
          onConfirm={productToDelete ? confirmDeleteProduct : toggleSiteStatus}
          onCancel={() => {
            setShowConfirmation(false);
            setProductToDelete(null);
          }}
        />
      )}
    </div>
  );
}