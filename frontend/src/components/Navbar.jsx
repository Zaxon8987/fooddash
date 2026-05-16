import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { fadeDown, staggerFast, slideRight } from '../lib/animations';

export default function Navbar({ onCartClick, onAuthClick, onNavigate, currentView }) {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [showMenu, setShowMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Home', view: 'home' },
    ...(user ? [
      { label: 'Orders', view: 'orders' },
      { label: 'Favorites', view: 'favorites' },
    ] : []),
  ];

  return (
    <motion.nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm' : 'bg-white/50 backdrop-blur-sm'}`}
      initial={{ y: -80 }} animate={{ y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.button onClick={() => onNavigate?.('home')} className="flex items-center gap-2" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <motion.span className="text-2xl" animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>🍔</motion.span>
            <span className="text-xl font-bold gradient-text">FoodDash</span>
          </motion.button>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <motion.button key={link.view} onClick={() => onNavigate?.(link.view)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-colors ${currentView === link.view ? 'text-primary' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {link.label}
                {currentView === link.view && (
                  <motion.div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full" layoutId="navIndicator" transition={{ type: 'spring', stiffness: 300, damping: 25 }} />
                )}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <motion.button onClick={onCartClick} className="relative p-2 hover:bg-gray-100 rounded-xl transition"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[11px] font-bold rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}>
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {user ? (
              <div className="relative">
                <motion.button onClick={() => setShowMenu(!showMenu)} className="w-9 h-9 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm shadow-orange-200"
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  {user.name?.[0]}
                </motion.button>
                <AnimatePresence>
                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                      <motion.div className="absolute right-0 top-12 w-56 bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl z-20 overflow-hidden"
                        variants={fadeDown} initial="hidden" animate="visible" exit={{ opacity: 0, y: -10, transition: { duration: 0.15 } }}>
                        <div className="p-4 border-b border-gray-50">
                          <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <motion.div className="p-2" variants={staggerFast} initial="hidden" animate="visible">
                          <NavMenuItem label="My Profile" icon="👤" onClick={() => { onNavigate?.('profile'); setShowMenu(false); }} />
                          <NavMenuItem label="My Orders" icon="📋" onClick={() => { onNavigate?.('orders'); setShowMenu(false); }} />
                          <NavMenuItem label="Favorites" icon="❤️" onClick={() => { onNavigate?.('favorites'); setShowMenu(false); }} />
                          <div className="border-t border-gray-50 mt-1 pt-1">
                            <NavMenuItem label="Logout" icon="🚪" onClick={() => { logout(); setShowMenu(false); onNavigate?.('home'); }} danger />
                          </div>
                        </motion.div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button onClick={onAuthClick} className="bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white px-5 py-2 rounded-full text-sm font-medium transition shadow-sm shadow-orange-200"
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

function NavMenuItem({ label, icon, onClick, danger }) {
  return (
    <motion.button onClick={onClick} variants={slideRight}
      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition font-medium ${danger ? 'text-red-500 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}`}>
      <span>{icon}</span> {label}
    </motion.button>
  );
}
