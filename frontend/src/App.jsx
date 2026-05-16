import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import RestaurantMenu from './components/RestaurantMenu';
import Cart from './components/Cart';
import Auth from './components/Auth';
import OrderTracking from './components/OrderTracking';
import Checkout from './components/Checkout';
import Profile from './components/Profile';
import Favorites from './components/Favorites';
import Footer from './components/Footer';
import { fadeUp } from './lib/animations';

function AppContent() {
  const [view, setView] = useState('home');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    document.body.style.overflow = showCart || showAuth ? 'hidden' : 'auto';
  }, [showCart, showAuth]);

  function handleRestaurantClick(restaurant) {
    setSelectedRestaurant(restaurant.id);
    setView('restaurant');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function navigate(v) {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderView() {
    switch (view) {
      case 'restaurant':
        return <RestaurantMenu key={view} restaurantId={selectedRestaurant} onBack={() => navigate('home')} onCartClick={() => setShowCart(true)} />;
      case 'orders':
        return <OrderTracking key={view} onBack={() => navigate('home')} />;
      case 'checkout':
        return <Checkout key={view} onBack={() => navigate('cart')} onOrderSuccess={() => navigate('orders')} />;
      case 'profile':
        return <Profile key={view} onBack={() => navigate('home')} onViewOrders={() => navigate('orders')} />;
      case 'favorites':
        return <Favorites key={view} onBack={() => navigate('home')} onRestaurantClick={handleRestaurantClick} />;
      default:
        return <HomePage key={view} onRestaurantClick={handleRestaurantClick} />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onCartClick={() => setShowCart(true)} onAuthClick={() => setShowAuth(true)} onNavigate={navigate} currentView={view} />
      <main className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div key={view} variants={fadeUp} initial="hidden" animate="visible" exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}>
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <AnimatePresence>{showCart && <Cart key="cart" onClose={() => setShowCart(false)} onCheckout={() => { setShowCart(false); navigate('checkout'); }} />}</AnimatePresence>
      <AnimatePresence>{showAuth && <Auth key="auth" onClose={() => setShowAuth(false)} />}</AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
