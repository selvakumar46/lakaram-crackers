import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  XCircle, 
  Search, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  Sparkles, 
  AlertCircle,
  RefreshCw,
  Eye
} from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchOrders } from '../services/api';
import { CATEGORIES } from '../data/defaultProducts';

export default function AdminDashboard({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('lakaram_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'add' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Form State
  const initialForm = {
    id: '',
    name: '',
    category: 'sparklers',
    description: '',
    packSize: '1 Box (10 Pcs)',
    originalPrice: 200,
    discountPercent: 75,
    discountedPrice: 50,
    soundLevel: 'Low',
    kidSafe: false,
    greenCrackerCertified: true,
    image: '',
    stock: 100,
    rating: 5
  };

  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [formSuccess, setFormSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const prodRes = await fetchProducts();
      setProducts(prodRes.data || []);
      const ordRes = await fetchOrders();
      setOrders(ordRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Auth check
  const handlePinSubmit = (e) => {
    e?.preventDefault();
    // Default owner PIN is 1234
    if (pinInput === '1234' || pinInput === 'lakaram') {
      setIsAuthenticated(true);
      sessionStorage.setItem('lakaram_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Default PIN is 1234');
    }
  };

  // Image Upload handler (supports local file upload via FileReader base64)
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setImagePreview(base64String);
      setFormData(prev => ({ ...prev, image: base64String }));
    };
    reader.readAsDataURL(file);
  };

  // Pricing auto-calculation
  const handleOriginalPriceChange = (val) => {
    const original = parseFloat(val) || 0;
    const disc = formData.discountPercent || 75;
    const discounted = Math.round(original * (100 - disc) / 100);
    setFormData(prev => ({
      ...prev,
      originalPrice: original,
      discountedPrice: discounted
    }));
  };

  const handleDiscountChange = (val) => {
    const disc = parseInt(val) || 0;
    const original = formData.originalPrice || 0;
    const discounted = Math.round(original * (100 - disc) / 100);
    setFormData(prev => ({
      ...prev,
      discountPercent: disc,
      discountedPrice: discounted
    }));
  };

  // Submit Product Form
  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.originalPrice <= 0) {
      alert('Please provide Product Name, Category, and Original Price.');
      return;
    }

    const defaultImages = {
      'sparklers': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&auto=format&fit=crop&q=60',
      'chakkars': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=60',
      'flower-pots': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=60',
      'rockets': 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=500&auto=format&fit=crop&q=60',
      'aerial-shots': 'https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=500&auto=format&fit=crop&q=60',
      'sound-crackers': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500&auto=format&fit=crop&q=60',
      'atom-bombs': 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?w=500&auto=format&fit=crop&q=60',
      'gift-boxes': 'https://images.unsplash.com/photo-1543257580-7269da773bf5?w=500&auto=format&fit=crop&q=60',
      'kids-special': 'https://images.unsplash.com/photo-1531844251246-9a1bfaae09fc?w=500&auto=format&fit=crop&q=60'
    };

    const finalImage = formData.image || defaultImages[formData.category] || defaultImages['sparklers'];

    const payload = {
      ...formData,
      id: editingId || formData.id || ('LKM-' + Math.floor(100 + Math.random() * 900)),
      image: finalImage,
      stock: parseInt(formData.stock) || 0
    };

    if (editingId) {
      await updateProduct(editingId, payload);
      setFormSuccess('Product updated successfully!');
    } else {
      await createProduct(payload);
      setFormSuccess('New product created and added to store catalog!');
    }

    await loadData();
    setTimeout(() => {
      setFormSuccess('');
      setEditingId(null);
      setFormData(initialForm);
      setImagePreview('');
      setActiveTab('inventory');
    }, 1200);
  };

  // Edit product trigger
  const handleEditClick = (prod) => {
    setEditingId(prod.id);
    setFormData({
      id: prod.id,
      name: prod.name,
      category: prod.category,
      description: prod.description || '',
      packSize: prod.packSize || '1 Box',
      originalPrice: prod.originalPrice,
      discountPercent: prod.discountPercent || 75,
      discountedPrice: prod.discountedPrice,
      soundLevel: prod.soundLevel || 'Low',
      kidSafe: prod.kidSafe || false,
      greenCrackerCertified: prod.greenCrackerCertified !== false,
      image: prod.image || '',
      stock: prod.stock !== undefined ? prod.stock : 100,
      rating: prod.rating || 5
    });
    setImagePreview(prod.image || '');
    setActiveTab('add');
  };

  // Delete product
  const handleDeleteClick = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteProduct(id);
      loadData();
    }
  };

  // Filter products in inventory
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCatFilter === 'all' || p.category === selectedCatFilter;
    const matchesSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // If not logged in with PIN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#090b12] flex items-center justify-center p-4">
        <div className="bg-[#121625] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-xl font-bold text-white font-serif mb-1">
            Lakaram Crackers Store Admin
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Enter the store manager PIN to add products, manage stock, and view customer orders.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: 1234)"
                autoFocus
                className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-3 text-center text-lg tracking-widest text-amber-400 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{pinError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg hover:opacity-95 transition-all"
            >
              Unlock Admin Console
            </button>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => { setPinInput('1234'); setIsAuthenticated(true); sessionStorage.setItem('lakaram_admin_auth', 'true'); }}
                className="text-amber-400 hover:underline"
              >
                Quick Demo Login (PIN: 1234)
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hover:text-white"
              >
                Return to Store
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0c14] text-slate-100 flex flex-col">
      {/* Admin Top Navigation */}
      <header className="bg-[#121625] border-b border-amber-500/20 px-4 sm:px-8 py-3.5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a2034] hover:bg-[#252c48] text-xs font-semibold text-slate-300 transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white font-serif">Lakaram Admin Panel</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/30">
                  Manager Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Manage Catalog, Upload Images & Track Orders</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="flex items-center gap-1 bg-[#181d2f] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setActiveTab('inventory'); setEditingId(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'inventory' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('add'); if (!editingId) setFormData(initialForm); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'add' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{editingId ? 'Edit Product' : '+ Add Product'}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Orders ({orders.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB 1: ADD / EDIT PRODUCT */}
        {activeTab === 'add' && (
          <div className="max-w-3xl mx-auto bg-[#121625] rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white font-serif">
                  {editingId ? `Edit Product (${formData.id})` : 'Add New Cracker Product'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter product details, pricing, sound level, and upload the product image.
                </p>
              </div>

              {editingId && (
                <button
                  onClick={() => { setEditingId(null); setFormData(initialForm); setImagePreview(''); }}
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            {formSuccess && (
              <div className="p-3 mb-6 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{formSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitProduct} className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">
                    Product Code / ID
                  </label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="e.g. SPK-06 (Auto if blank)"
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">
                    Product Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. 50cm Royal Gold Sparkler Wand"
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Pack Size / Units</label>
                  <input
                    type="text"
                    value={formData.packSize}
                    onChange={(e) => setFormData({ ...formData, packSize: e.target.value })}
                    placeholder="e.g. 1 Box (10 Pcs), 1 Hamper Box"
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="bg-[#181c2d] p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>Sivakasi Pricing & Discount Calculation</span>
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">
                      Actual Rate (₹) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.originalPrice}
                      onChange={(e) => handleOriginalPriceChange(e.target.value)}
                      className="w-full bg-[#101320] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">
                      Festival Discount (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="99"
                      value={formData.discountPercent}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      className="w-full bg-[#101320] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">
                      Offer Price (₹)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({ ...formData, discountedPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#101320] border border-amber-500/50 rounded-xl py-2 px-3 text-xs text-amber-400 font-extrabold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Specifications & Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Sound Level</label>
                  <select
                    value={formData.soundLevel}
                    onChange={(e) => setFormData({ ...formData, soundLevel: e.target.value })}
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Zero Sound">Zero Sound (Light Only)</option>
                    <option value="Low">Low Noise (Safe)</option>
                    <option value="Medium">Medium Noise</option>
                    <option value="High">High Blast (Outdoor Concussion)</option>
                    <option value="Mixed">Mixed Assortment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1 font-semibold">Initial Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex flex-col justify-end space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.kidSafe}
                      onChange={(e) => setFormData({ ...formData, kidSafe: e.target.checked })}
                      className="rounded text-amber-500"
                    />
                    <span>Kid-Safe Cracker</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={formData.greenCrackerCertified}
                      onChange={(e) => setFormData({ ...formData, greenCrackerCertified: e.target.checked })}
                      className="rounded text-emerald-500"
                    />
                    <span>Green Cracker Certified</span>
                  </label>
                </div>
              </div>

              {/* Product Image Section */}
              <div className="bg-[#181c2d] p-4 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" />
                  <span>Product Image Upload & Link</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* Local File Upload Button */}
                  <div>
                    <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                      Upload from your Computer
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-amber-400 rounded-2xl p-4 cursor-pointer bg-[#101320] transition-colors">
                      <Upload className="w-6 h-6 text-amber-400 mb-1" />
                      <span className="text-xs font-bold text-slate-200">Select Image File</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, WEBP (stored instantly)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or Image URL */}
                  <div>
                    <label className="block text-xs text-slate-300 mb-1 font-medium">
                      Or Paste Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => {
                        setFormData({ ...formData, image: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[#101320] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 mb-2"
                    />
                    <p className="text-[10px] text-slate-400">
                      If left blank, a high-quality festive cracker picture for this category is used automatically.
                    </p>
                  </div>
                </div>

                {/* Preview Thumbnail */}
                {imagePreview && (
                  <div className="pt-2 flex items-center gap-3 border-t border-slate-800">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-amber-400/40"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">Image Ready</span>
                      <button
                        type="button"
                        onClick={() => { setImagePreview(''); setFormData({ ...formData, image: '' }); }}
                        className="text-[11px] text-red-400 hover:underline mt-0.5"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Vivid color sparkles, prolonged burning duration, safe family novelty..."
                  className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setActiveTab('inventory'); setEditingId(null); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg hover:opacity-95 transition-all"
                >
                  {editingId ? 'Update Product' : 'Save & Publish Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: INVENTORY TABLE */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-[#121625] p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products by name or code..."
                  className="w-full bg-[#0d101a] border border-slate-700 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCatFilter}
                  onChange={(e) => setSelectedCatFilter(e.target.value)}
                  className="bg-[#0d101a] border border-slate-700 text-xs text-white rounded-xl py-2 px-3 focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => { setEditingId(null); setFormData(initialForm); setActiveTab('add'); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all whitespace-nowrap shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Inventory List */}
            <div className="bg-[#121625] rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0e111d] text-slate-400 text-[10px] uppercase tracking-wider font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-3 w-14">Image</th>
                      <th className="py-3 px-3 w-20">Code</th>
                      <th className="py-3 px-3">Product Name</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3 text-right">Actual</th>
                      <th className="py-3 px-3 text-right">75% Offer</th>
                      <th className="py-3 px-3 text-center">Stock</th>
                      <th className="py-3 px-3 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No products found.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-slate-800/20 transition-colors">
                          <td className="py-2.5 px-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-300">
                            {prod.id}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-white block">{prod.name}</span>
                            <span className="text-[10px] text-slate-400">{prod.packSize}</span>
                          </td>
                          <td className="py-2.5 px-3 capitalize text-slate-300">
                            {prod.category}
                          </td>
                          <td className="py-2.5 px-3 text-right line-through text-slate-400">
                            ₹{prod.originalPrice.toFixed(0)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-black text-amber-400">
                            ₹{prod.discountedPrice.toFixed(0)}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.stock > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-red-950 text-red-300 border border-red-500/30'
                            }`}>
                              {prod.stock > 0 ? `${prod.stock} in stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleEditClick(prod)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(prod.id, prod.name)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-[#121625] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base font-serif">Customer Orders Received</h3>
                <p className="text-xs text-slate-400">Track online inquiries and WhatsApp bill submissions.</p>
              </div>
              <button
                onClick={loadData}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 bg-[#121625] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No orders received yet. Once customers order through the website or WhatsApp, they will appear here.
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((ord, idx) => (
                  <div key={idx} className="bg-[#121625] rounded-2xl border border-slate-800 p-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-300 text-xs">{ord.orderId}</span>
                        <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.2 rounded font-bold">
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-xs font-black text-white">
                        Total: ₹{(ord.grandTotal || ord.subtotal || 0).toFixed(2)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Customer</span>
                        <span className="font-semibold text-white">{ord.customerName}</span>
                        <span className="block text-slate-400">{ord.phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Delivery Address</span>
                        <span className="text-slate-300 truncate block">{ord.deliveryAddress} - {ord.pincode}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase font-bold">Items Count</span>
                        <span className="text-slate-300">{ord.items?.length || ord.totalItemCount || 0} items ordered</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
