import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ onCartClick, onAuthClick, onNavigate, currentView }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => onNavigate?.('home')} className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-bold text-gray-800">FoodDash</span>
          </button>

          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => onNavigate?.('home')} className={`text-sm font-medium transition ${currentView === 'home' ? 'text-primary' : 'text-gray-600 hover:text-gray-800'}`}>Home</button>
            {user && (
              <>
                <button onClick={() => onNavigate?.('orders')} className={`text-sm font-medium transition ${currentView === 'orders' ? 'text-primary' : 'text-gray-600 hover:text-gray-800'}`}>Orders</button>
                <button onClick={() => onNavigate?.('favorites')} className={`text-sm font-medium transition ${currentView === 'favorites' ? 'text-primary' : 'text-gray-600 hover:text-gray-800'}`}>Favorites</button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onCartClick} className="relative p-2 hover:bg-gray-100 rounded-xl transition">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg>
              {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setShowMenu(!showMenu)} className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold hover:bg-primary-dark transition">{user.name?.[0]}</button>
                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl border border-gray-100 shadow-xl z-20 overflow-hidden">
                      <div className="p-4 border-b border-gray-50">
                        <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <div className="p-2">
                        <NavMenuItem label="My Profile" icon="👤" onClick={() => { onNavigate?.('profile'); setShowMenu(false); }} />
                        <NavMenuItem label="My Orders" icon="📋" onClick={() => { onNavigate?.('orders'); setShowMenu(false); }} />
                        <NavMenuItem label="Favorites" icon="❤️" onClick={() => { onNavigate?.('favorites'); setShowMenu(false); }} />
                        <div className="border-t border-gray-50 mt-1 pt-1">
                          <button onClick={() => { logout(); setShowMenu(false); onNavigate?.('home'); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition font-medium">
                            <span>🚪</span> Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={onAuthClick} className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-full text-sm font-medium transition shadow-sm shadow-orange-200">Sign In</button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavMenuItem({ label, icon, onClick }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition">{icon} {label}</button>
  );
}
