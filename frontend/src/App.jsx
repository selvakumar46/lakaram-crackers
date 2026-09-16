import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import Navbar from './components/Navbar';
import FestiveHero from './components/FestiveHero';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import QuickOrderSheet from './components/QuickOrderSheet';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import SafetyModal from './components/SafetyModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

function MainStore() {
  const { viewMode, isAdminOpen, setIsAdminOpen } = useCart();

  if (isAdminOpen) {
    return <AdminDashboard onClose={() => setIsAdminOpen(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e17] selection:bg-amber-500 selection:text-black">
      {/* Header */}
      <Navbar />

      {/* Hero Banner */}
      <FestiveHero />

      {/* Dynamic View: Catalog Mode vs Sivakasi Quick Order Sheet */}
      <main className="flex-1">
        {viewMode === 'catalog' ? (
          <>
            <CategoryFilter />
            <ProductGrid />
          </>
        ) : (
          <QuickOrderSheet />
        )}
      </main>

      {/* Modals & Overlays */}
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <SafetyModal />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainStore />
    </CartProvider>
  );
}
