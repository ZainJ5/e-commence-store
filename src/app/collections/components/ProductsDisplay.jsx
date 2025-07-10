import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const ProductsDisplay = ({ products, title }) => {
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    if (filter === 'all') return true;
    return product.productTags.includes(filter);
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === 'price-asc') return a.discountedPrice - b.discountedPrice;
    if (sort === 'price-desc') return b.discountedPrice - a.discountedPrice;
    return 0;
  });

  return (
    <div className="bg-[#f5f0e6] min-h-screen p-8 text-black">
      <h1 className="text-3xl font-bold text-center mb-8">{title}</h1>
      <div className="flex justify-between mb-4">
        <div>
          <label className="mr-2">Filter:</label>
          <select onChange={handleFilterChange} className="p-2 rounded bg-[#bab2a7]">
            <option value="all">All</option>
            <option value="new-arrival">New Arrivals</option>
            <option value="featured">Featured</option>
            <option value="mr-shah-collection">Mr. Shah Collection</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Sort:</label>
          <select onChange={handleSortChange} className="p-2 rounded bg-[#bab2a7]">
            <option value="">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {sortedProducts.map((product) => (
          <motion.div key={product._id} variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductsDisplay;
