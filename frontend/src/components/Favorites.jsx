import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import RestaurantCard from './RestaurantCard';
import { stagger, fadeUp } from '../lib/animations';

export default function Favorites({ onBack, onRestaurantClick }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/restaurants/favorites/list', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setFavorites(data.favorites);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-64 animate-shimmer rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div className="flex items-center gap-4 mb-6" variants={fadeUp} initial="hidden" animate="visible">
        <motion.button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition" whileHover={{ x: -2 }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </motion.button>
        <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
      </motion.div>

      {favorites.length === 0 ? (
        <motion.div className="text-center py-16 text-gray-500" variants={fadeUp} initial="hidden" animate="visible">
          <motion.span className="text-5xl block mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>❤️</motion.span>
          <p className="font-bold text-gray-800 mb-1">No favorites yet</p>
          <p className="text-sm">Save your favorite restaurants here</p>
        </motion.div>
      ) : (
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" variants={stagger} initial="hidden" animate="visible">
          {favorites.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={onRestaurantClick} />)}
        </motion.div>
      )}
    </div>
  );
}
