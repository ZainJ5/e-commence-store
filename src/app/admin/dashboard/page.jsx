'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  useState(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setMessage({
          type: 'error',
          content: 'Failed to load products. Please try again later.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', content: '' });
    
    try {
      const formData = new FormData(formRef.current);
      
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add product');
      }
      
      setMessage({
        type: 'success',
        content: 'Product added successfully!'
      });
      
      // Reset form
      formRef.current.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh products
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      
      if (productsData.products) {
        setProducts(productsData.products);
      }
      
      // Refresh the page data
      router.refresh();
      
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage({
        type: 'error',
        content: error.message || 'Failed to add product. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Add and manage your products</p>
      </header>

      {/* Add Product Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Product</h2>
        
        {message.content && (
          <div 
            className={`mb-4 p-4 rounded-md ${
              message.type === 'error' 
                ? 'bg-red-100 text-red-700 border border-red-300' 
                : 'bg-green-100 text-green-700 border border-green-300'
            }`}
          >
            {message.content}
          </div>
        )}
        
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Original Price (e.g. R 399,99)
              </label>
              <input
                type="text"
                id="originalPrice"
                name="originalPrice"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Discounted Price (e.g. R 299,99)
              </label>
              <input
                type="text"
                id="discountedPrice"
                name="discountedPrice"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                ref={fileInputRef}
                required
                accept="image/*"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-800 hover:bg-emerald-900 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Products</h2>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-800 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No products found. Add your first product above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Original Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discounted Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.originalPrice}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-emerald-600 font-medium">{product.discountedPrice}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}