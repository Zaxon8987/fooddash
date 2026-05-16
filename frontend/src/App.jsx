import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import RestaurantMenu from './components/RestaurantMenu';
import Cart from './components/Cart';
import Auth from './components/Auth';
import Footer from './components/Footer';

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onCartClick={() => setShowCart(true)}
        onAuthClick={() => setShowAuth(true)}
      />
      <main className="flex-1">
        {view === 'restaurant' && selectedRestaurant ? (
          <RestaurantMenu
            restaurantId={selectedRestaurant}
            onBack={() => setView('home')}
            onCartClick={() => setShowCart(true)}
          />
        ) : (
          <HomePage onRestaurantClick={handleRestaurantClick} />
        )}
      </main>
      <Footer />

      {showCart && <Cart onClose={() => setShowCart(false)} />}
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
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
