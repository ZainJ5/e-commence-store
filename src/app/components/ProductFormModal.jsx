"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-emerald-800">
          {product ? "Edit Product" : "Add New Product"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Product Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50/50 text-gray-800 placeholder-emerald-400 text-sm sm:text-base transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2.5 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50/50 text-gray-800 placeholder-emerald-400 text-sm sm:text-base transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">Original Price*</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50/50 text-gray-800 placeholder-emerald-400 text-sm sm:text-base transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700 mb-2">Discounted Price</label>
                  <input
                    type="number"
                    name="discountedPrice"
                    value={formData.discountedPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50/50 text-gray-800 placeholder-emerald-400 text-sm sm:text-base transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50/50 text-gray-800 text-sm sm:text-base transition-colors"
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
                <label className="block text-sm font-medium text-emerald-700 mb-2">Stock*</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50/50 text-gray-800 placeholder-emerald-400 text-sm sm:text-base transition-colors"
                  required
                />
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-50/50 text-gray-800 text-sm sm:text-base transition-colors"
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Available Sizes</label>
                <div className="flex flex-wrap gap-3">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <label key={size} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={size}
                        checked={formData.size.includes(size)}
                        onChange={(e) => handleCheckboxChange(e, "size")}
                        className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-400"
                      />
                      <span className="ml-2 text-sm text-emerald-700">{size}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Available Colors</label>
                <div className="flex flex-wrap gap-3">
                  {["Black", "White", "Red", "Blue", "Green", "Gray"].map((color) => (
                    <label key={color} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={color}
                        checked={formData.color.includes(color)}
                        onChange={(e) => handleCheckboxChange(e, "color")}
                        className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-400"
                      />
                      <span className="ml-2 text-sm text-emerald-700">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-emerald-700 mb-2">Product Image*</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  {...(!product && { required: true })}
                />
                {imagePreview && (
                  <div className="mt-3 relative w-32 h-32 border border-emerald-200 rounded-lg overflow-hidden shadow-sm">
                    <Image
                      src={imagePreview}
                      alt="Product preview"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-400"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-emerald-700">
                  Active (Available for sale)
                </label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-emerald-100">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-emerald-200 rounded-lg shadow-sm text-sm font-medium text-emerald-700 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition-colors"
            >
              {product ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;