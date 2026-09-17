import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpDown, Filter, SearchX } from 'lucide-react';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../services/api';

export default function ProductGrid() {
  const { selectedCategory, searchQuery, setSearchQuery, catalogProducts } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setLoading(true);
    fetchProducts(selectedCategory, searchQuery)
      .then(res => {
        setProducts(res.data);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, catalogProducts]);

  // Sort logic
  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low') return a.discountedPrice - b.discountedPrice;
    if (sortBy === 'price-high') return b.discountedPrice - a.discountedPrice;
    if (sortBy === 'sound-low') {
      const soundOrder = { 'Zero Sound': 1, 'Low': 2, 'Medium': 3, 'High': 4 };
      return (soundOrder[a.soundLevel] || 5) - (soundOrder[b.soundLevel] || 5);
    }
    return 0; // featured default
  });

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Browse Products</span>
            <span className="text-xs bg-slate-800 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
              {products.length} Items Available
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            All prices include flat 75% festival discount directly from Sivakasi factory.
          </p>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#161a29] border border-slate-700/80 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
          >
            <option value="featured">Featured / Best Sellers</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="sound-low">Sound: Zero & Low Noise First</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="festive-glass-card rounded-2xl h-80 bg-slate-800/40" />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-[#131625] rounded-3xl border border-slate-800">
          <SearchX className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No crackers found</h3>
          <p className="text-xs text-slate-400 mb-4">
            No matching products for "{searchQuery}". Try searching for something else.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
          {sortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
