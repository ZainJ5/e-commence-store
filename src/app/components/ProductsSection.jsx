'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProductsSection() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('men');
  const [pagination, setPagination] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchNewArrivalProducts = async () => {
      try {
        const response = await fetch('/api/products/new-arrival?limit=20');

        if (!response.ok) {
          throw new Error('Failed to fetch new arrival products');
        }

        const data = await response.json();
        setProducts(data.products || []);
        setPagination(data.pagination || {});
      } catch (error) {
        console.error('Error fetching new arrival products:', error);
        setError('Failed to load new arrival products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    // Load cart and wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    const savedCart = localStorage.getItem('cart');

    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    fetchNewArrivalProducts();
  }, []);

  const categories = [
    { id: 'men', name: "Men's", icon: '' },
    { id: 'women', name: "Women's", icon: '' }
  ];

  const filteredProducts = products.filter(product => {
    if (product.isActive === false) return false;

    if (selectedCategory === 'men') {
      return product.gender === 'men' || product.gender === 'unisex';
    } else if (selectedCategory === 'women') {
      return product.gender === 'women' || product.gender === 'unisex';
    }

    return true;
  });

  const handleCategoryChange = (categoryId) => {
    if (categoryId === selectedCategory) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setSelectedCategory(categoryId);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 200);
  };

  const formatPrice = (price) => {
    return `Rs.${Number(price).toLocaleString()}.00`;
  };

  const calculateDiscount = (original, discounted) => {
    if (!discounted || discounted >= original) return null;
    const percentage = Math.round((1 - discounted / original) * 100);
    return `-${percentage}%`;
  };

  const toggleWishlist = (productId) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];

    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const addToCart = (product) => {
    const existingItemIndex = cart.findIndex(item => item.id === product._id);

    let newCart;
    if (existingItemIndex >= 0) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
    } else {
      newCart = [...cart, {
        id: product._id,
        name: product.name,
        price: product.discountedPrice || product.originalPrice,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
        quantity: 1
      }];
    }

    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-12">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-black mb-2"
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
              NEW ARRIVALS
            </h2>
            <p className="text-sm text-gray-600 font-light tracking-wide uppercase mb-4">
              Discover our latest collection
            </p>

            <div className="flex justify-center lg:justify-start">
              <div className="relative inline-flex bg-gray-100 rounded-full p-1">
                <div
                  className="absolute top-1 h-[calc(100%-8px)] bg-black rounded-full transition-all duration-300 ease-in-out"
                  style={{
                    width: 'calc(50% - 4px)',
                    left: selectedCategory === 'men' ? '4px' : 'calc(50% + 0px)',
                  }}
                />

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`relative z-10 px-3 py-1 text-xs font-medium rounded-full transition-colors duration-300 ease-in-out ${selectedCategory === category.id
                        ? 'text-white'
                        : 'text-gray-600 hover:text-black'
                      }`}
                    style={{
                      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                      width: '80px'
                    }}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3 mt-6 lg:mt-0">
            <button
              className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-all duration-300 cursor-pointer"
              onClick={() => {
                const container = document.querySelector('.products-scroll');
                container?.scrollBy({ left: -300, behavior: 'smooth' });
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-all duration-300 cursor-pointer"
              onClick={() => {
                const container = document.querySelector('.products-scroll');
                container?.scrollBy({ left: 300, behavior: 'smooth' });
              }}
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center animate-fadeIn" role="alert">
            <span className="font-medium">{error}</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg text-center animate-fadeIn" role="alert">
            <span className="font-medium">No new arrival products available in this category.</span>
          </div>
        ) : (
          <div className={`products-scroll transition-all duration-300 ease-in-out ${isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
            }`}>
            <style jsx>{`
  .products-scroll {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    scroll-behavior: smooth;
    padding-bottom: 8px;
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  .products-scroll::-webkit-scrollbar {
    display: none;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out;
  }

  .staggered-animation {
    animation: fadeInUp 0.6s ease-out forwards;
    opacity: 0;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .product-card {
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
  }
  
  .product-card:hover {
    transform: translateY(-5px);
  }
  
  .product-image-container {
    height: 0;
    padding-bottom: 100%; /* 1:1 Aspect Ratio */
    position: relative;
    overflow: hidden;
  }
  
  .product-info {
    display: flex;
    flex-direction: column;
  }
  
  .product-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 0;
  }
`}</style>

            <div className="flex gap-4 lg:gap-6 pb-4" style={{ width: 'max-content' }}>
              {filteredProducts.map((product, index) => (
                <div
                  key={product._id}
                  className="product-card flex-shrink-0 w-48 sm:w-56 md:w-64 lg:w-72 staggered-animation"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both',
                  }}
                >
                  <div 
                    className="relative mb-3 cursor-pointer bg-white rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                    onClick={() => window.location.href = `/products/${product._id}`}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-gray-50">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover object-top transform transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01m0 0H6" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {product.discountedPrice && product.discountedPrice < product.originalPrice && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                        {calculateDiscount(product.originalPrice, product.discountedPrice)}
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product._id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-white/70 backdrop-blur-sm hover:bg-white rounded-full transition-colors duration-200 shadow opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        className={`w-4 h-4 ${wishlist.includes(product._id) ? 'text-red-500' : 'text-gray-600'}`}
                        fill={wishlist.includes(product._id) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <Link href={`/products/${product._id}`}>
                      <h3 className="text-m sm:text-m font-medium pb-2 text-gray-900 hover:text-gray-700 transition-colors duration-200 uppercase tracking-wide line-clamp-1 product-name mb-1"
                        style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex justify-center items-center space-x-2">
                      {product.discountedPrice && product.discountedPrice < product.originalPrice ? (
                        <>
                          <span className="text-gray-900 font-semibold text-sm lg:text-base">{formatPrice(product.discountedPrice)}</span>
                          <span className="text-gray-400 line-through text-xs lg:text-sm">{formatPrice(product.originalPrice)}</span>
                        </>
                      ) : (
                        <span className="text-gray-900 font-semibold text-sm lg:text-base">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>

                    {/* Stock Status */}
                    {(product.stock === 0 || (product.stock > 0 && product.stock <= 5)) && (
                      <div className="text-xs mt-1">
                        <span className={`${product.stock === 0 ? 'text-red-600' : 'text-yellow-600'} font-medium`}>
                          {product.stock === 0 ? 'Out of stock' : `Only ${product.stock} left`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredProducts.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/collections/new-arrival"
              className="inline-flex items-center text-black border border-black px-6 py-2 rounded hover:bg-black hover:text-white transition-colors duration-300 text-sm font-medium group"
              style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
            >
              View All New Arrivals
              <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}