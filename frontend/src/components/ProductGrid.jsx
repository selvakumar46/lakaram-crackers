import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpDown, Filter, SearchX, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../services/api';

const ITEMS_PER_PAGE = 30;

export default function ProductGrid() {
  const { selectedCategory, searchQuery, setSearchQuery, catalogProducts } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetchProducts(selectedCategory, searchQuery)
      .then(res => {
        setProducts(res.data);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery, catalogProducts]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, sortBy]);

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

  // Pagination calculation
  const totalItems = sortedProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    const elem = document.getElementById('products-catalog-section');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="products-catalog-section" className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <span>Browse Products</span>
            <span className="text-xs bg-slate-800 text-amber-300 font-semibold px-2 py-0.5 rounded-full">
              {totalItems} Items Available
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Showing {totalItems > 0 ? `${startIndex + 1}–${endIndex}` : '0'} of {totalItems} crackers • Page {currentPage} of {totalPages}
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
        <>
          {/* Products Grid - 30 items per page */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6">
            {paginatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400 font-medium">
                Showing <span className="text-amber-400 font-bold">{startIndex + 1}</span> to{' '}
                <span className="text-amber-400 font-bold">{endIndex}</span> of{' '}
                <span className="text-white font-bold">{totalItems}</span> products (30 per page)
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5">
                {/* First page button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-[#141828] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="First Page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg bg-[#141828] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105'
                        : 'bg-[#141828] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg bg-[#141828] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* Last page button */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-[#141828] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-all"
                  title="Last Page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
