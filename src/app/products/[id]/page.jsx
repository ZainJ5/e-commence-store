'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data.product);
        
        if (data.product.size && data.product.size.length > 0) {
          setSelectedSize(data.product.size[0]);
        }
        if (data.product.color && data.product.color.length > 0) {
          setSelectedColor(data.product.color[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
      } finally {
        setIsLoading(false);
      }
    };

    const savedWishlist = localStorage.getItem('wishlist');
    const savedCart = localStorage.getItem('cart');
    
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
    
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetchProduct();
  }, [params.id]);

  const formatPrice = (price) => {
    return `Rs.${Number(price).toLocaleString()}.00`;
  };

  const calculateDiscount = (original, discounted) => {
    if (!discounted || discounted >= original) return null;
    const percentage = Math.round((1 - discounted / original) * 100);
    return percentage;
  };

  const toggleWishlist = () => {
    const newWishlist = wishlist.includes(product._id) 
      ? wishlist.filter(id => id !== product._id) 
      : [...wishlist, product._id];
    
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const addToCart = () => {
    if (!selectedSize && product.size && product.size.length > 0) {
      alert('Please select a size');
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.discountedPrice || product.originalPrice,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity
    };

    const existingItemIndex = cart.findIndex(item => 
      item.id === product._id && 
      item.size === selectedSize && 
      item.color === selectedColor
    );

    let newCart;
    if (existingItemIndex >= 0) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
    } else {
      newCart = [...cart, cartItem];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    alert('Added to cart successfully!');
  };

  const buyNow = () => {
    addToCart();
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-neutral-200 border-t-neutral-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        {/* Add padding to account for fixed navbar */}
        <div className="flex-1 flex items-center justify-center pt-20 lg:pt-24">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-neutral-900 mb-6">Product Not Found</h1>
            <Link href="/collections" className="text-neutral-900 font-medium hover:underline text-lg">
              Back to Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* <Navbar /> */}
      
      {/* Add padding-top to account for fixed navbar */}
      <div className="">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <nav className="flex items-center space-x-2 text-sm font-medium text-neutral-600 mb-8">
            <Link href="/" className="hover:text-neutral-900 transition-colors duration-200">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-neutral-900 transition-colors duration-200">Products</Link>
            <span>/</span>
            <span className="text-neutral-900">{product.name}</span>
          </nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-100">
                  <svg className="w-24 h-24 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6unless 0 0 0-2-2l1.586-1.586a2 2 0 012.828 0L16 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              <div>
                {product.isNew && (
                  <span className="inline-block bg-neutral-900 text-white text-xs font-semibold uppercase px-4 py-1.5 rounded-full mb-4 tracking-wide">
                    New Arrival
                  </span>
                )}
                <h1 className="text-4xl font-light text-neutral-900 leading-tight" 
                    style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                  {product.name}
                </h1>
                <p className="text-sm text-neutral-600 uppercase tracking-wider mt-2">
                  {product.category} • {product.gender}'S
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  {product.discountedPrice ? (
                    <>
                      <span className="text-2xl font-medium text-neutral-900">
                        {formatPrice(product.discountedPrice)}
                      </span>
                      <span className="text-lg text-neutral-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="bg-red-600 text-white text-xs font-bold uppercase px-3 py-1.5 rounded-full">
                        {calculateDiscount(product.originalPrice, product.discountedPrice)}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-medium text-neutral-900">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 5 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                <span className="text-sm font-medium text-neutral-700">
                  {product.stock > 5 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </span>
              </div>

              {/* Size Selection */}
              {product.size && product.size.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-neutral-900">Select Size</label>
                    <button
                      onClick={() => setShowSizeGuide(true)}
                      className="text-sm text-neutral-600 font-medium hover:text-neutral-900 transition-colors duration-200"
                    >
                      Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.size.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 border rounded-lg text-sm font-medium transition-all duration-300 ${
                          selectedSize === size
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.color && product.color.length > 0 && (
                <div className="space-y-4">
                  <label className="text-sm font-medium text-neutral-900">Select Color</label>
                  <div className="flex flex-wrap gap-2">
                    {product.color.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-5 py-2.5 border rounded-lg text-sm font-medium transition-all duration-300 capitalize ${
                          selectedColor === color
                            ? 'border-neutral-900 bg-neutral-900 text-white'
                            : 'border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-100'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-neutral-900">Quantity</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-900 hover:bg-neutral-100 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-medium text-neutral-900 text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-900 hover:bg-neutral-100 transition-all duration-300"
                    disabled={quantity >= product.stock}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <button
                    onClick={addToCart}
                    disabled={product.stock === 0}
                    className="flex-1 bg-neutral-900 text-white py-3.5 px-8 rounded-lg font-medium text-sm uppercase tracking-wide hover:bg-neutral-800 transition-all duration-300 disabled:bg-neutral-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={toggleWishlist}
                    className="p-3 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-all duration-300"
                  >
                    <svg 
                      className={`w-6 h-6 ${wishlist.includes(product._id) ? 'text-red-500 fill-current' : 'text-neutral-900'}`} 
                      fill={wishlist.includes(product._id) ? 'currentColor' : 'none'} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                
                {product.stock > 0 && (
                  <button
                    onClick={buyNow}
                    className="w-full bg-neutral-900 text-white py-3.5 px-8 rounded-lg font-medium text-sm uppercase tracking-wide hover:bg-neutral-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Buy Now
                  </button>
                )}
              </div>

              {/* Product Features */}
              <div className="border-t pt-8 space-y-6">
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-neutral-700">Free Shipping</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-neutral-700">Easy Returns</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-neutral-700">Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M12 12h.01M12 12h.01" />
                    </svg>
                    <span className="text-neutral-700">Quality Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16 border-t pt-8">
            <div className="flex space-x-8 border-b">
              {[
                { id: 'description', label: 'Description' },
                { id: 'details', label: 'Product Details' },
                { id: 'shipping', label: 'Shipping & Returns' },
                { id: 'reviews', label: 'Reviews' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`pb-4 text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                    selectedTab === tab.id
                      ? 'border-neutral-900 text-neutral-900'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-8">
              {selectedTab === 'description' && (
                <div className="prose max-w-none">
                  <p className="text-neutral-700 leading-relaxed text-base">
                    {product.description || 'No description available for this product.'}
                  </p>
                </div>
              )}

              {selectedTab === 'details' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium text-neutral-900 text-lg mb-4">Product Information</h3>
                    <dl className="space-y-3">
                      <div className="flex">
                        <dt className="w-24 text-sm text-neutral-600 font-medium">Category:</dt>
                        <dd className="text-sm text-neutral-700 capitalize">{product.category}</dd>
                      </div>
                      <div className="flex">
                        <dt className="w-24 text-sm text-neutral-600 font-medium">Gender:</dt>
                        <dd className="text-sm text-neutral-700 capitalize">{product.gender}</dd>
                      </div>
                      {product.size && product.size.length > 0 && (
                        <div className="flex">
                          <dt className="w-24 text-sm text-neutral-600 font-medium">Sizes:</dt>
                          <dd className="text-sm text-neutral-700">{product.size.join(', ')}</dd>
                        </div>
                      )}
                      {product.color && product.color.length > 0 && (
                        <div className="flex">
                          <dt className="w-24 text-sm text-neutral-600 font-medium">Colors:</dt>
                          <dd className="text-sm text-neutral-700 capitalize">{product.color.join(', ')}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 text-lg mb-4">Care Instructions</h3>
                    <ul className="text-sm text-neutral-700 space-y-2">
                      <li>• Machine wash cold</li>
                      <li>• Do not bleach</li>
                      <li>• Tumble dry low</li>
                      <li>• Iron on low heat</li>
                      <li>• Do not dry clean</li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedTab === 'shipping' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="font-medium text-neutral-900 text-lg mb-4">Shipping Information</h3>
                    <ul className="text-sm text-neutral-700 space-y-2">
                      <li>• Free standard shipping on orders over Rs.2,000</li>
                      <li>• Express shipping available for Rs.200</li>
                      <li>• Standard delivery: 3-5 business days</li>
                      <li>• Express delivery: 1-2 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 text-lg mb-4">Returns & Exchanges</h3>
                    <ul className="text-sm text-neutral-700 space-y-2">
                      <li>• 30-day return policy</li>
                      <li>• Items must be unworn and in original condition</li>
                      <li>• Free returns on all orders</li>
                      <li>• Exchanges available for different sizes/colors</li>
                    </ul>
                  </div>
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div className="text-center py-12">
                  <p className="text-neutral-700 text-base mb-6">No reviews yet. Be the first to review this product!</p>
                  <button className="bg-neutral-900 text-white px-8 py-3 rounded-lg font-medium text-sm uppercase tracking-wide hover:bg-neutral-800 transition-all duration-300 shadow-md hover:shadow-lg">
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 bg-neutral-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-neutral-900">Size Guide</h2>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  className="text-neutral-600 hover:text-neutral-900 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 text-neutral-900 font-medium">Size</th>
                      <th className="text-left py-3 text-neutral-900 font-medium">Chest (cm)</th>
                      <th className="text-left py-3 text-neutral-900 font-medium">Waist (cm)</th>
                      <th className="text-left py-3 text-neutral-900 font-medium">Hip (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 text-neutral-700">XS</td>
                      <td className="py-3 text-neutral-700">86-91</td>
                      <td className="py-3 text-neutral-700">66-71</td>
                      <td className="py-3 text-neutral-700">91-96</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 text-neutral-700">S</td>
                      <td className="py-3 text-neutral-700">91-96</td>
                      <td className="py-3 text-neutral-700">71-76</td>
                      <td className="py-3 text-neutral-700">96-101</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 text-neutral-700">M</td>
                      <td className="py-3 text-neutral-700">96-101</td>
                      <td className="py-3 text-neutral-700">76-81</td>
                      <td className="py-3 text-neutral-700">101-106</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 text-neutral-700">L</td>
                      <td className="py-3 text-neutral-700">101-106</td>
                      <td className="py-3 text-neutral-700">81-86</td>
                      <td className="py-3 text-neutral-700">106-111</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-neutral-700">XL</td>
                      <td className="py-3 text-neutral-700">106-111</td>
                      <td className="py-3 text-neutral-700">86-91</td>
                      <td className="py-3 text-neutral-700">111-116</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}