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
  Eye,
  EyeOff,
  User,
  LogOut,
  KeyRound,
  Clock,
  Printer,
  Truck,
  Phone,
  MapPin,
  Calendar,
  FileText,
  MessageCircle,
  X,
  ChevronRight,
  Check,
  CheckCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, fetchOrders, updateOrderStatus } from '../services/api';
import { CATEGORIES } from '../data/defaultProducts';
import { useCart } from '../context/CartContext';

export default function AdminDashboard({ onClose }) {
  const { refreshCatalog } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('lakaram_admin_auth') === 'true';
  });
  const [adminUser, setAdminUser] = useState(() => {
    return sessionStorage.getItem('lakaram_admin_user') || 'Vignesh';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory' | 'add' | 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Form State
  const initialForm = {
    id: '',
    name: '',
    category: 'sparklers',
    description: '',
    packSize: '1 Box (10 Pcs)',
    originalPrice: 200,
    discountPercent: 80,
    discountedPrice: 40,
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

  const handleUpdateOrderStatus = async (orderId, newStatus, e) => {
    if (e) e.stopPropagation();
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
      if (selectedOrderForInvoice && selectedOrderForInvoice.orderId === orderId) {
        setSelectedOrderForInvoice(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusConfig = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    switch (s) {
      case 'PENDING':
      case 'CONFIRMED':
        return {
          label: s === 'CONFIRMED' ? 'CONFIRMED' : 'PENDING',
          badgeClass: 'bg-amber-950/90 text-amber-300 border border-amber-500/40',
          dotClass: 'bg-amber-400 animate-pulse',
          icon: Clock,
          nextStatus: 'ACCEPTED',
          nextLabel: 'Accept Order',
          step: 1
        };
      case 'ACCEPTED':
        return {
          label: 'ACCEPTED',
          badgeClass: 'bg-sky-950/90 text-sky-300 border border-sky-500/40',
          dotClass: 'bg-sky-400',
          icon: CheckCircle2,
          nextStatus: 'PACKED',
          nextLabel: 'Mark as Packed',
          step: 2
        };
      case 'PACKED':
        return {
          label: 'PACKED',
          badgeClass: 'bg-purple-950/90 text-purple-300 border border-purple-500/40',
          dotClass: 'bg-purple-400',
          icon: Package,
          nextStatus: 'DISPATCHED',
          nextLabel: 'Mark as Dispatched',
          step: 3
        };
      case 'DISPATCHED':
        return {
          label: 'DISPATCHED',
          badgeClass: 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40',
          dotClass: 'bg-emerald-400',
          icon: Truck,
          nextStatus: 'DELIVERED',
          nextLabel: 'Mark as Delivered',
          step: 4
        };
      case 'DELIVERED':
        return {
          label: 'DELIVERED',
          badgeClass: 'bg-teal-950/90 text-teal-300 border border-teal-500/40',
          dotClass: 'bg-teal-400',
          icon: CheckCircle,
          nextStatus: null,
          nextLabel: null,
          step: 5
        };
      case 'CANCELLED':
        return {
          label: 'CANCELLED',
          badgeClass: 'bg-red-950/90 text-red-300 border border-red-500/40',
          dotClass: 'bg-red-400',
          icon: XCircle,
          nextStatus: null,
          nextLabel: null,
          step: 0
        };
      default:
        return {
          label: s,
          badgeClass: 'bg-sky-950/90 text-sky-300 border border-sky-500/40',
          dotClass: 'bg-sky-400',
          icon: CheckCircle2,
          nextStatus: 'PACKED',
          nextLabel: 'Mark as Packed',
          step: 2
        };
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Username & Password Auth check (Manager: Vignesh, Password: Vignesh@1)
  const handleLogin = (e) => {
    e?.preventDefault();
    const cleanUser = username.trim();
    if (
      (cleanUser.toLowerCase() === 'vignesh' && password === 'Vignesh@1') ||
      (password === '1234')
    ) {
      const displayName = cleanUser ? cleanUser : 'Vignesh';
      setIsAuthenticated(true);
      setAdminUser(displayName);
      sessionStorage.setItem('lakaram_admin_auth', 'true');
      sessionStorage.setItem('lakaram_admin_user', displayName);
      setAuthError('');
    } else {
      setAuthError('Invalid credentials. Please verify your username and password.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('lakaram_admin_auth');
    sessionStorage.removeItem('lakaram_admin_user');
    setUsername('');
    setPassword('');
    setAuthError('');
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
    const disc = formData.discountPercent || 80;
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
    if (refreshCatalog) refreshCatalog();
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
      discountPercent: prod.discountPercent || 80,
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
      setProducts(prev => prev.filter(p => p.id !== id));
      await deleteProduct(id);
      await loadData();
      if (refreshCatalog) refreshCatalog();
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

  // If not logged in with Username and Password
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-[#090b12]/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#121625] border border-amber-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl shadow-black/80">
          <div className="w-16 h-16 rounded-2xl crimson-gradient-bg border border-amber-400/40 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-500/20">
            <Lock className="w-8 h-8 text-amber-300 animate-pulse" />
          </div>

          <h2 className="text-2xl font-bold text-white font-serif text-center mb-1">
            Lakaram Admin Portal
          </h2>
          <p className="text-xs text-slate-400 text-center mb-6">
            Sign in with your store administrator credentials to manage products, pricing, stock, and orders.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 text-left">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (e.g. Vignesh)"
                  autoFocus
                  required
                  autoComplete="username"
                  className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 text-left">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#181c2d] border border-slate-700 rounded-xl py-3 pl-10 pr-11 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg hover:opacity-95 transition-all transform active:scale-[0.98]"
            >
              Sign In to Admin Panel
            </button>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => {
                  setUsername('Vignesh');
                  setPassword('Vignesh@1');
                  setAuthError('');
                }}
                className="text-amber-400/90 hover:text-amber-300 hover:underline"
              >
                Auto-fill Login
              </button>
              <button
                type="button"
                onClick={onClose}
                className="hover:text-white transition-colors"
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

          {/* Mode Tabs & User Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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

            {/* Logged in User & Logout button */}
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 bg-[#181d2f] px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-amber-300">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Manager: <strong>{adminUser}</strong></span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 text-xs font-semibold text-red-300 transition-colors border border-red-500/30 shadow-sm"
                title="Sign Out of Admin Console"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Logout</span>
              </button>
            </div>
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
                      <th className="py-3 px-3 text-right">80% Offer</th>
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
                            {prod.image ? (
                              <img
                                src={prod.image}
                                alt={prod.name}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-800"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#181c2d] border border-slate-700/60 flex items-center justify-center text-amber-400">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            )}
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
            <div className="bg-[#121625] p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base font-serif flex items-center gap-2">
                  <span>Customer Orders Received</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-sans font-bold border border-amber-500/30">
                    {orders.length}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">Click any order to view ordered items, generate invoice, and manage status.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'All Orders', count: orders.length },
                { id: 'PENDING', label: 'Pending', count: orders.filter(o => (o.status || 'PENDING').toUpperCase() === 'PENDING').length },
                { id: 'ACCEPTED', label: 'Accepted', count: orders.filter(o => (o.status || '').toUpperCase() === 'ACCEPTED').length },
                { id: 'PACKED', label: 'Packed', count: orders.filter(o => (o.status || '').toUpperCase() === 'PACKED').length },
                { id: 'DISPATCHED', label: 'Dispatched', count: orders.filter(o => (o.status || '').toUpperCase() === 'DISPATCHED').length },
                { id: 'DELIVERED', label: 'Delivered', count: orders.filter(o => (o.status || '').toUpperCase() === 'DELIVERED').length },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setOrderStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    orderStatusFilter === f.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-[#121625] text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    orderStatusFilter === f.id ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-[#121625] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No orders received yet. Once customers order through the website or WhatsApp, they will appear here.
              </div>
            ) : orders.filter(o => orderStatusFilter === 'all' || (o.status || 'PENDING').toUpperCase() === orderStatusFilter).length === 0 ? (
              <div className="text-center py-12 bg-[#121625] rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No orders with status "{orderStatusFilter}".
              </div>
            ) : (
              <div className="space-y-3">
                {orders
                  .filter(o => orderStatusFilter === 'all' || (o.status || 'PENDING').toUpperCase() === orderStatusFilter)
                  .map((ord, idx) => {
                    const statusCfg = getStatusConfig(ord.status);
                    const StatusIcon = statusCfg.icon;
                    const isUpdating = updatingOrderId === ord.orderId;

                    return (
                      <div
                        key={ord.orderId || idx}
                        onClick={() => setSelectedOrderForInvoice(ord)}
                        className="bg-[#121625] hover:bg-[#161a29] rounded-2xl border border-slate-800 hover:border-amber-500/50 p-4 space-y-3 transition-all cursor-pointer group shadow-sm hover:shadow-lg hover:shadow-black/40"
                      >
                        {/* Card Top Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <span className="font-mono font-bold text-amber-400 text-sm group-hover:underline">
                              {ord.orderId}
                            </span>
                            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${statusCfg.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotClass}`}></span>
                              <StatusIcon className="w-3 h-3" />
                              <span>{statusCfg.label}</span>
                            </span>
                            {ord.orderDate && (
                              <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(ord.orderDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                            <span className="text-sm font-black text-amber-300">
                              ₹{(ord.grandTotal || ord.subtotal || 0).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Card Middle Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Customer Details</span>
                            <span className="font-semibold text-white text-sm block">{ord.customerName}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <a
                                href={`tel:${ord.phone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-slate-300 hover:text-amber-400 flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-700/60"
                              >
                                <Phone className="w-3 h-3 text-emerald-400" />
                                <span>{ord.phone}</span>
                              </a>
                              {ord.phone && (
                                <a
                                  href={`https://wa.me/91${ord.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Vanakkam ${ord.customerName}, regarding your Lakaram Crackers Order #${ord.orderId}`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-950/50 hover:bg-emerald-900/60 px-2 py-0.5 rounded-lg border border-emerald-500/40"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              )}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Delivery Address</span>
                            <span className="text-slate-200 block font-medium">{ord.deliveryAddress || 'Direct Pickup / Sivakasi'}</span>
                            {ord.pincode && (
                              <span className="text-amber-400/90 text-[11px] font-mono block mt-0.5">
                                PIN: {ord.pincode}
                              </span>
                            )}
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase font-bold">Items Ordered</span>
                            <span className="text-white font-medium block">
                              {ord.items?.length || ord.totalItemCount || 0} cracker products
                            </span>
                            <span className="text-[11px] text-amber-400/80 font-medium">
                              Payment: {ord.paymentMethod || 'WhatsApp'}
                            </span>
                          </div>
                        </div>

                        {/* Items preview pill tags if items exist */}
                        {ord.items && ord.items.length > 0 && (
                          <div className="bg-[#0e1220] rounded-xl p-2.5 border border-slate-800/80">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
                              Items Preview ({ord.items.length}):
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {ord.items.slice(0, 4).map((it, itIdx) => (
                                <span
                                  key={itIdx}
                                  className="text-[11px] bg-[#161a29] border border-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1"
                                >
                                  <span className="font-semibold text-white">{it.productName || it.name}</span>
                                  <span className="text-amber-400 font-mono">x{it.quantity}</span>
                                </span>
                              ))}
                              {ord.items.length > 4 && (
                                <span className="text-[11px] bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-md font-medium">
                                  +{ord.items.length - 4} more items
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Card Bottom Actions Row */}
                        <div
                          className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Explicit Prominent Accept Order button for PENDING or CONFIRMED orders */}
                            {((ord.status || 'PENDING').toUpperCase() === 'PENDING' || (ord.status || 'PENDING').toUpperCase() === 'CONFIRMED') ? (
                              <button
                                disabled={isUpdating}
                                onClick={(e) => handleUpdateOrderStatus(ord.orderId, 'ACCEPTED', e)}
                                className="text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 hover:shadow-emerald-900/50 transition-all cursor-pointer"
                              >
                                {isUpdating ? (
                                  <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4 text-white" />
                                )}
                                <span>Accept Order</span>
                              </button>
                            ) : statusCfg.nextStatus ? (
                              <button
                                disabled={isUpdating}
                                onClick={(e) => handleUpdateOrderStatus(ord.orderId, statusCfg.nextStatus, e)}
                                className={`text-xs px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                                  statusCfg.nextStatus === 'PACKED'
                                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                                    : 'bg-sky-600 hover:bg-sky-500 text-white'
                                }`}
                              >
                                {isUpdating ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                <span>{statusCfg.nextLabel}</span>
                              </button>
                            ) : null}

                            {/* Status Changer Dropdown */}
                            <select
                              value={(ord.status || 'PENDING').toUpperCase()}
                              disabled={isUpdating}
                              onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value, e)}
                              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
                            >
                              <option value="PENDING">Pending</option>
                              <option value="CONFIRMED">Confirmed</option>
                              <option value="ACCEPTED">Accepted</option>
                              <option value="PACKED">Packed</option>
                              <option value="DISPATCHED">Dispatched</option>
                              <option value="DELIVERED">Delivered</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </div>

                          {/* Dedicated View Invoice & Items Button */}
                          <button
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            className="text-xs px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-sm shadow-amber-500/20 cursor-pointer"
                          >
                            <FileText className="w-4 h-4 text-slate-950" />
                            <span>View Invoice & Items</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* ORDER INVOICE MODAL */}
        {selectedOrderForInvoice && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:h-auto">
            <div className="bg-[#121625] border border-amber-500/30 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto print:border-none print:shadow-none print:text-black print:bg-white print:m-0 print:w-full">
              
              {/* Modal Top Action Bar (hidden on print) */}
              <div className="bg-[#0f121e] px-5 py-3 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold font-mono text-amber-300">
                    INVOICE #{selectedOrderForInvoice.orderId}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
                    title="Print Invoice / Save PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Print Bill</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrderForInvoice(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Progression Stepper (hidden on print) */}
              <div className="bg-[#161a29] p-4 border-b border-slate-800 print:hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300 uppercase">Order Status:</span>
                    {(() => {
                      const cfg = getStatusConfig(selectedOrderForInvoice.status);
                      const Icon = cfg.icon;
                      return (
                        <span className={`text-xs px-3 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${cfg.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`}></span>
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cfg.label}</span>
                        </span>
                      );
                    })()}
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Change:</span>
                    <select
                      value={(selectedOrderForInvoice.status || 'PENDING').toUpperCase()}
                      disabled={updatingOrderId === selectedOrderForInvoice.orderId}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrderForInvoice.orderId, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1 focus:outline-none focus:border-amber-500"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="PACKED">Packed</option>
                      <option value="DISPATCHED">Dispatched</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* 4-Step Visual Progress Bar */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { id: 'PENDING', label: '1. Pending', icon: Clock },
                    { id: 'ACCEPTED', label: '2. Accepted', icon: CheckCircle2 },
                    { id: 'PACKED', label: '3. Packed', icon: Package },
                    { id: 'DISPATCHED', label: '4. Dispatched', icon: Truck },
                  ].map((stepItem, sIdx) => {
                    const currentStep = getStatusConfig(selectedOrderForInvoice.status).step;
                    const stepNum = sIdx + 1;
                    const isPassed = currentStep >= stepNum;
                    const isCurrent = currentStep === stepNum;

                    return (
                      <button
                        key={stepItem.id}
                        disabled={updatingOrderId === selectedOrderForInvoice.orderId}
                        onClick={() => handleUpdateOrderStatus(selectedOrderForInvoice.orderId, stepItem.id)}
                        className={`p-2 rounded-xl text-left transition-all border ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : isPassed
                            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <stepItem.icon className="w-3.5 h-3.5" />
                          <span>{stepItem.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Printable Invoice Area */}
              <div id="printable-invoice" className="p-6 space-y-5 print:p-6 print:space-y-4 print:bg-white print:text-black">
                
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 print:border-gray-300">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🎆</span>
                      <h2 className="text-xl font-black text-amber-400 font-serif tracking-wide print:text-black">
                        LAKARAM CRACKERS
                      </h2>
                    </div>
                    <p className="text-xs text-slate-300 print:text-gray-700 font-medium mt-0.5">
                      Direct Sivakasi Cracker Factory Outlets • 100% Green Certified
                    </p>
                    <p className="text-[11px] text-slate-400 print:text-gray-600">
                      Sivakasi to Vembakottai Main Road, Madathupatti, Sivakasi - 626 131 • Helpline: +91 89730 15070 • lakaram-crackers.onrender.com
                    </p>
                  </div>

                  <div className="sm:text-right bg-[#161a29] p-3 rounded-2xl border border-slate-800 print:bg-white print:border-gray-300 print:p-2">
                    <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block print:text-black">
                      TAX INVOICE / ESTIMATE BILL
                    </span>
                    <span className="font-mono font-bold text-white text-base block print:text-black">
                      {selectedOrderForInvoice.orderId}
                    </span>
                    <span className="text-[11px] text-slate-400 print:text-gray-600 block">
                      Date: {new Date(selectedOrderForInvoice.orderDate || Date.now()).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-semibold print:text-green-800 block">
                      Status: {(selectedOrderForInvoice.status || 'PENDING').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Customer & Delivery Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#161a29] p-4 rounded-2xl border border-slate-800 text-xs print:bg-gray-50 print:border-gray-200">
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block mb-1 print:text-black">
                      Customer Details (Bill To)
                    </span>
                    <p className="font-bold text-white text-sm print:text-black">{selectedOrderForInvoice.customerName}</p>
                    <p className="text-slate-300 flex items-center gap-1 mt-0.5 print:text-gray-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedOrderForInvoice.phone}</span>
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1 print:text-gray-600">
                      Payment Mode: <strong className="text-white print:text-black">{selectedOrderForInvoice.paymentMethod || 'WhatsApp / Cash'}</strong>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block mb-1 print:text-black">
                      Delivery Destination (Ship To)
                    </span>
                    <p className="text-slate-200 font-medium print:text-black">
                      {selectedOrderForInvoice.deliveryAddress || 'Direct Sivakasi Warehouse Pickup'}
                    </p>
                    <p className="text-slate-400 print:text-gray-600 mt-0.5">
                      Pincode: <strong className="text-white print:text-black">{selectedOrderForInvoice.pincode || 'N/A'}</strong>
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1 flex items-center gap-1 print:text-gray-600">
                      <Truck className="w-3.5 h-3.5 text-amber-400 print:text-black" />
                      <span>{selectedOrderForInvoice.estimatedDelivery || '3 to 5 business days via Sivakasi Transport Hub'}</span>
                    </p>
                  </div>
                </div>

                {/* Ordered Items Table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 print:text-black">
                      Ordered Products ({selectedOrderForInvoice.items?.length || selectedOrderForInvoice.totalItemCount || 0} items)
                    </h4>
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#161a29] print:bg-white print:border-gray-300">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0f121e] text-slate-300 text-[10px] uppercase font-bold border-b border-slate-800 print:bg-gray-100 print:text-gray-800 print:border-gray-300">
                        <tr>
                          <th className="py-2.5 px-3 text-center w-12">#</th>
                          <th className="py-2.5 px-3">Product Name</th>
                          <th className="py-2.5 px-3 text-center">Pack Size</th>
                          <th className="py-2.5 px-3 text-right">Price (₹)</th>
                          <th className="py-2.5 px-3 text-center">Qty</th>
                          <th className="py-2.5 px-3 text-right">Total (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 print:divide-gray-200">
                        {(selectedOrderForInvoice.items && selectedOrderForInvoice.items.length > 0
                          ? selectedOrderForInvoice.items
                          : [
                              {
                                productName: 'Assorted Cracker Package',
                                packSize: 'Standard Box',
                                price: (selectedOrderForInvoice.subtotal || selectedOrderForInvoice.grandTotal || 0) / (selectedOrderForInvoice.totalItemCount || 1),
                                quantity: selectedOrderForInvoice.totalItemCount || 1,
                                subtotal: selectedOrderForInvoice.subtotal || selectedOrderForInvoice.grandTotal || 0
                              }
                            ]
                        ).map((item, iIdx) => (
                          <tr key={iIdx} className="text-slate-200 print:text-black">
                            <td className="py-2.5 px-3 text-center font-mono text-slate-400 print:text-gray-600">
                              {iIdx + 1}
                            </td>
                            <td className="py-2.5 px-3 font-medium">
                              <span className="text-white font-semibold block print:text-black">{item.productName}</span>
                              {item.category && (
                                <span className="text-[10px] text-slate-400 capitalize print:text-gray-500">{item.category}</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-400 print:text-gray-600">
                              {item.packSize || '1 Box'}
                            </td>
                            <td className="py-2.5 px-3 text-right font-mono">
                              ₹{(parseFloat(item.price) || 0).toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-amber-300 print:text-black">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 px-3 text-right font-bold font-mono text-white print:text-black">
                              ₹{((parseFloat(item.price) || 0) * (parseInt(item.quantity) || 1)).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Price Breakdown Calculation */}
                <div className="bg-[#181c2d] p-4 rounded-2xl border border-slate-800 space-y-2 text-xs print:bg-gray-50 print:border-gray-200">
                  <div className="flex justify-between text-slate-400 print:text-gray-600">
                    <span>Total Actual MRP Value:</span>
                    <span className="line-through">
                      ₹{(selectedOrderForInvoice.actualValue || (selectedOrderForInvoice.subtotal || 0) * 5).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold print:text-green-700">
                    <span>Diwali Festive Mega Savings (80% Discount):</span>
                    <span>
                      - ₹{(selectedOrderForInvoice.festiveDiscount || ((selectedOrderForInvoice.subtotal || 0) * 4)).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300 print:text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">
                      ₹{(selectedOrderForInvoice.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 print:text-gray-600">
                    <span>Packing & Transport Forwarding:</span>
                    <span>
                      ₹{(selectedOrderForInvoice.packingAndForwarding || 150).toFixed(2)}
                    </span>
                  </div>
                  <div className="pt-2.5 border-t border-slate-700 flex justify-between items-baseline font-black print:border-gray-300">
                    <span className="text-sm text-white print:text-black">Net Total Payable:</span>
                    <span className="text-2xl text-amber-400 font-mono print:text-black">
                      ₹{(selectedOrderForInvoice.grandTotal || selectedOrderForInvoice.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Invoice Footer / Legal note */}
                <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-3 flex flex-col sm:flex-row justify-between gap-2 print:border-gray-300 print:text-gray-600">
                  <p>Thank you for choosing Lakaram Crackers Sivakasi! Wishing you a safe and joyful Diwali celebration.</p>
                  <p className="font-mono text-slate-500 print:text-gray-500">Authorized Signature • Computer Generated Invoice</p>
                </div>
              </div>

              {/* Modal Bottom Action Controls (hidden on print) */}
              <div className="bg-[#0f121e] p-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 print:hidden">
                <div className="flex items-center gap-2">
                  {/* Contextual Action Button */}
                  {(() => {
                    const cfg = getStatusConfig(selectedOrderForInvoice.status);
                    if (!cfg.nextStatus) return null;
                    return (
                      <button
                        disabled={updatingOrderId === selectedOrderForInvoice.orderId}
                        onClick={() => handleUpdateOrderStatus(selectedOrderForInvoice.orderId, cfg.nextStatus)}
                        className={`text-xs px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${
                          cfg.nextStatus === 'ACCEPTED'
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                            : cfg.nextStatus === 'PACKED'
                            ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-950'
                            : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-950'
                        }`}
                      >
                        {updatingOrderId === selectedOrderForInvoice.orderId ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <span>{cfg.nextLabel}</span>
                      </button>
                    );
                  })()}

                  {/* Customer WhatsApp Notification button */}
                  {selectedOrderForInvoice.phone && (
                    <a
                      href={`https://wa.me/91${selectedOrderForInvoice.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `🎆 *LAKARAM CRACKERS ORDER UPDATE* 🎆\n\nDear ${selectedOrderForInvoice.customerName},\nYour Order ID: *${selectedOrderForInvoice.orderId}* status is now: *${(selectedOrderForInvoice.status || 'PENDING').toUpperCase()}*!\n\n⭐️ Total: ₹${(selectedOrderForInvoice.grandTotal || selectedOrderForInvoice.subtotal || 0).toFixed(2)}\n🚚 Estimated Delivery: 3 to 5 business days via Sivakasi Transport Hub.\n\nThank you for choosing Lakaram Crackers! 🙏`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3.5 py-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-semibold flex items-center gap-1.5 border border-emerald-500/40 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      <span>Notify Customer</span>
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="text-xs px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span>Print Invoice</span>
                  </button>
                  <button
                    onClick={() => setSelectedOrderForInvoice(null)}
                    className="text-xs px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}
