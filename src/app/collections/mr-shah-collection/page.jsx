"use client"
import React, { useEffect, useState } from 'react';
import ProductsDisplay from '../components/ProductsDisplay';

const ShahCollectionPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products/mr-shah-collection');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <ProductsDisplay products={products} title="Mr. Shah Collection"/>;
};

export default ShahCollectionPage;