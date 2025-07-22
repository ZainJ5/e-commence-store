"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from 'react-hot-toast';

const ProductFormModal = ({ 
  product, 
  onSubmit = () => {}, 
  onCancel = () => {}, 
  isInline = false 
}) => {
  const initialFormData = {
    _id: "",
    name: "",
    description: "",
    originalPrice: "",
    discountedPrice: "",
    category: "",
    type: "",
    size: [],
    color: [], 
    gender: "unisex",
    fabric: "",
    customizable: false,
    stock: "",
    images: [],
    isActive: true,
    productTags: []
  };

  const [formData, setFormData] = useState(initialFormData);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [customColor, setCustomColor] = useState(""); 
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedColors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Red", value: "#FF0000" },
    { name: "Blue", value: "#0000FF" },
    { name: "Green", value: "#008000" },
    { name: "Gray", value: "#808080" },
    { name: "Navy", value: "#000080" },
    { name: "Pink", value: "#FFC0CB" },
    { name: "Yellow", value: "#FFFF00" },
    { name: "Purple", value: "#800080" },
    { name: "Orange", value: "#FFA500" },
    { name: "Brown", value: "#A52A2A" }
  ];

  const availableProductTags = [
    { value: 'new-arrival', label: 'New Arrival', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'featured', label: 'Featured', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'mr-shah-collection', label: 'Mr. Shah Collection', color: 'bg-purple-100 text-purple-800 border-purple-300' }
  ];

  const resetForm = () => {
    setFormData(initialFormData);
    setImagePreviews([]);
    setCustomColor("");
    
    imagePreviews.forEach(preview => {
      if (!preview.isExisting && preview.url.startsWith('blob:')) {
        URL.revokeObjectURL(preview.url);
      }
    });
    
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories. Please try again.', {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        setIsLoadingTypes(true);
        const response = await fetch('/api/type');
        if (!response.ok) {
          throw new Error('Failed to fetch types');
        }
        const data = await response.json();
        setTypes(data.types || []);
      } catch (error) {
        console.error('Error fetching types:', error);
        toast.error('Failed to load types. Please try again.', {
          position: 'top-right',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            border: '1px solid #EF4444',
          },
        });
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchTypes();
  }, []);

  useEffect(() => {
    if (product) {
      let productColors = [];
      if (product.color) {
        if (Array.isArray(product.color)) {
          productColors = product.color;
        } else {
          productColors = [product.color];
        }
      }

      setFormData({
        _id: product._id || "",
        name: product.name || "",
        description: product.description || "",
        originalPrice: product.originalPrice || "",
        discountedPrice: product.discountedPrice || "",
        category: product.category?._id || product.category || "",
        type: product.type?._id || product.type || "",
        size: product.size || [],
        color: productColors,
        gender: product.gender || "unisex",
        fabric: product.fabric || "",
        customizable: product.customizable || false,
        stock: product.stock || "",
        images: [],
        isActive: product.isActive !== false,
        productTags: product.productTags || []
      });

      if (product.images && product.images.length > 0) {
        setImagePreviews(product.images.map(img => ({ url: img, isExisting: true })));
      }
    } else {
      resetForm();
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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

  const handleProductTagChange = (tagValue) => {
    setFormData((prev) => {
      const isSelected = prev.productTags.includes(tagValue);
      if (isSelected) {
        return { ...prev, productTags: prev.productTags.filter(tag => tag !== tagValue) };
      } else {
        return { ...prev, productTags: [...prev.productTags, tagValue] };
      }
    });
  };

  const handleColorChange = (colorName) => {
    setFormData((prev) => {
      const isSelected = prev.color.includes(colorName);
      if (isSelected) {
        return { ...prev, color: prev.color.filter(color => color !== colorName) };
      } else {
        return { ...prev, color: [...prev.color, colorName] };
      }
    });
  };

  const handleAddCustomColor = () => {
    const trimmedColor = customColor.trim();
    if (trimmedColor && !formData.color.includes(trimmedColor)) {
      setFormData((prev) => ({
        ...prev,
        color: [...prev.color, trimmedColor]
      }));
      setCustomColor("");
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      color: prev.color.filter(color => color !== colorToRemove)
    }));
  };

  const handleCustomColorKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomColor();
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 10;

    if (imagePreviews.length + files.length > maxImages) {
      toast.error(`You can only upload a maximum of ${maxImages} images per product.`, {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
      return;
    }

    const newImages = [];
    const newPreviews = [];

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        newImages.push(file);
        newPreviews.push({
          url: URL.createObjectURL(file),
          file,
          isExisting: false
        });
      }
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));

    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    const imageToRemove = imagePreviews[index];

    if (!imageToRemove.isExisting && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    setImagePreviews(prev => prev.filter((_, i) => i !== index));

    if (!imageToRemove.isExisting) {
      const fileIndex = formData.images.findIndex(file => file === imageToRemove.file);
      if (fileIndex !== -1) {
        setFormData(prev => ({
          ...prev,
          images: prev.images.filter((_, i) => i !== fileIndex)
        }));
      }
    }
  };

  const setMainImage = (index) => {
    const newPreviews = [...imagePreviews];
    const [mainImage] = newPreviews.splice(index, 1);
    newPreviews.unshift(mainImage);
    setImagePreviews(newPreviews);

    if (!mainImage.isExisting) {
      const imageIndex = formData.images.findIndex(file => file === mainImage.file);
      if (imageIndex !== -1) {
        const [mainFile] = formData.images.splice(imageIndex, 1);
        formData.images.unshift(mainFile);
        setFormData(prev => ({ ...prev, images: [...formData.images] }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.originalPrice || !formData.category || !formData.type || formData.stock === "") {
      toast.error('Please fill in all required fields: Name, Original Price, Category, Type, and Stock', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitFormData = new FormData();

      Object.keys(formData).forEach(key => {
        if (key === 'images') {
          formData.images.forEach((file, index) => {
            submitFormData.append(`images`, file);
          });
        } else if (key === 'size' || key === 'productTags' || key === 'color') {
          submitFormData.append(key, JSON.stringify(formData[key]));
        } else if (key === '_id') {
          if (product && formData._id) {
            submitFormData.append('id', formData._id);
          }
        } else {
          submitFormData.append(key, formData[key]);
        }
      });

      if (product) {
        const existingImages = imagePreviews
          .filter(img => img.isExisting)
          .map(img => img.url);

        if (existingImages.length > 0) {
          submitFormData.append('existingImages', JSON.stringify(existingImages));
        }
      }

      const token = localStorage.getItem('authToken');

      const response = await fetch('/api/products', {
        method: product ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit product');
      }

      const data = await response.json();
      
      toast.success(`Product ${product ? 'updated' : 'created'} successfully!`, {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
      
      if (!product) {
        resetForm();
      }
      
      if (typeof onSubmit === 'function') {
        onSubmit(data);
      } else {
        console.log('Product submitted successfully:', data);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error(error.message || 'An error occurred while submitting the product', {
        position: 'top-right',
        style: {
          background: '#FEE2E2',
          color: '#991B1B',
          border: '1px solid #EF4444',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (!product) {
      resetForm();
    }
    
    if (typeof onCancel === 'function') {
      onCancel();
    } else {
      console.log('Form cancelled');
    }
  };

  const isModal = !isInline && product;

  const formContent = (
    <div className="space-y-6">
      <Toaster />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-black placeholder-gray-400 text-sm transition-all"
                required
                maxLength={100}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-black placeholder-gray-400 text-sm transition-all"
                maxLength={2000}
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Original Price <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-black placeholder-gray-400 text-sm transition-all"
                  required
                  min="0"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Discounted Price</label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-black placeholder-gray-400 text-sm transition-all"
                  min="0"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-black text-sm transition-all"
                  required
                  disabled={isLoadingCategories || isSubmitting}
                >
                  <option value="">{isLoadingCategories ? 'Loading categories...' : 'Select Category'}</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Type <span className="text-red-500">*</span></label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-black text-sm transition-all"
                  required
                  disabled={isLoadingTypes || isSubmitting}
                >
                  <option value="">{isLoadingTypes ? 'Loading types...' : 'Select Type'}</option>
                  {types.map(type => (
                    <option key={type._id} value={type._id}>
                      {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Tags</label>
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Select special product categories (optional):</p>
                <div className="flex flex-wrap gap-2">
                  {availableProductTags.map((tag) => (
                    <label
                      key={tag.value}
                      className={`inline-flex items-center cursor-pointer transition-all ${
                        formData.productTags.includes(tag.value)
                          ? `${tag.color} border`
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:border-red-400'
                      } px-3 py-1.5 rounded-lg text-sm ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        value={tag.value}
                        checked={formData.productTags.includes(tag.value)}
                        onChange={() => handleProductTagChange(tag.value)}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <span className="font-medium">{tag.label}</span>
                    </label>
                  ))}
                </div>
                {formData.productTags.length > 0 && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Selected Tags:</h4>
                    <div className="flex flex-wrap gap-1">
                      {formData.productTags.map((tagValue) => {
                        const tag = availableProductTags.find(t => t.value === tagValue);
                        return (
                          <span
                            key={tagValue}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border-gray-300"
                          >
                            {tag?.label || tagValue}
                            <button
                              type="button"
                              onClick={() => handleProductTagChange(tagValue)}
                              className="ml-1 text-current hover:text-red-600"
                              disabled={isSubmitting}
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-black placeholder-gray-400 text-sm transition-all"
                  required
                  min="0"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-black text-sm transition-all"
                  disabled={isSubmitting}
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="kids">Kids</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Fabric</label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-black placeholder-gray-400 text-sm transition-all"
                  maxLength={100}
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="customizable"
                  id="customizable"
                  checked={formData.customizable}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  disabled={isSubmitting}
                />
                <label htmlFor="customizable" className="ml-2 text-sm font-medium text-gray-700">
                  Customizable
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                  <label key={size} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={size}
                      checked={formData.size.includes(size)}
                      onChange={(e) => handleCheckboxChange(e, "size")}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      disabled={isSubmitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">{size}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Available Colors</label>
              
              <div className="space-y-3">
                <p className="text-xs text-gray-500">Select from predefined colors:</p>
                <div className="grid grid-cols-3 gap-2">
                  {predefinedColors.map((color) => (
                    <label
                      key={color.name}
                      className={`flex items-center cursor-pointer p-2 rounded-lg border transition-all ${
                        formData.color.includes(color.name)
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-red-400'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.color.includes(color.name)}
                        onChange={() => handleColorChange(color.name)}
                        className="sr-only"
                        disabled={isSubmitting}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300 mr-2 flex-shrink-0"
                        style={{ backgroundColor: color.value }}
                      ></div>
                      <span className="text-sm text-gray-700 truncate">{color.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Add custom color:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter custom color name"
                    value={customColor}
                    onChange={(e) => setCustomColor(e.target.value)}
                    onKeyPress={handleCustomColorKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 text-black placeholder-gray-400 text-sm transition-all"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomColor}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!customColor.trim() || isSubmitting}
                  >
                    Add
                  </button>
                </div>
              </div>

              {formData.color.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Colors ({formData.color.length}):</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.color.map((colorName, index) => {
                      const predefinedColor = predefinedColors.find(c => c.name === colorName);
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-gray-800 border border-gray-300"
                        >
                          {predefinedColor && (
                            <div
                              className="w-3 h-3 rounded-full border border-gray-300 mr-2"
                              style={{ backgroundColor: predefinedColor.value }}
                            ></div>
                          )}
                          {colorName}
                          <button
                            type="button"
                            onClick={() => removeColor(colorName)}
                            className="ml-2 text-red-600 hover:text-red-800 font-medium"
                            disabled={isSubmitting}
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Product Images <span className="text-red-500">*</span> (Max 10 images)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                {...(!product && imagePreviews.length === 0 && { required: true })}
                disabled={isSubmitting}
              />
              {imagePreviews.length > 0 && (
                <div className="mt-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative group border border-gray-300 rounded-lg overflow-hidden shadow-sm"
                      >
                        <div className="relative w-full h-20">
                          <Image
                            src={preview.url}
                            alt={`Product preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex space-x-1">
                            {index !== 0 && (
                              <button
                                type="button"
                                onClick={() => setMainImage(index)}
                                className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                title="Set as main image"
                                disabled={isSubmitting}
                              >
                                Main
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                              title="Remove image"
                              disabled={isSubmitting}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-1 left-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded">
                            Main
                          </div>
                        )}
                        {preview.isExisting && (
                          <div className="absolute top-1 right-1 bg-gray-600 text-white text-xs px-1.5 py-0.5 rounded">
                            Existing
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {imagePreviews.length}/10 images uploaded. First image will be the main product image.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                disabled={isSubmitting}
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
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (product ? "Updating..." : "Adding...") 
              : (product ? "Update Product" : "Add Product")
            }
          </button>
        </div>
      </form>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 sm:p-6">
        <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          {formContent}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-emerald-100 h-full">
      {formContent}
    </div>
  );
};

export default ProductFormModal;