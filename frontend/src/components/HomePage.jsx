import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Hero from './Hero';
import RestaurantCard from './RestaurantCard';
import { stagger, fadeUp, fadeIn } from '../lib/animations';

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="h-48 animate-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded animate-shimmer" />
        <div className="h-4 w-1/2 rounded animate-shimmer" />
        <div className="flex justify-between">
          <div className="h-4 w-16 rounded animate-shimmer" />
          <div className="h-4 w-20 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ onRestaurantClick }) {
  const [restaurants, setRestaurants] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const restRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const [allRes, featRes] = await Promise.all([
          fetch('/api/restaurants'),
          fetch('/api/restaurants/featured')
        ]);
        const allData = await allRes.json();
        const featData = await featRes.json();
        setRestaurants(allData.restaurants);
        setFeatured(featData.restaurants);
      } catch (err) {
        console.error('Failed to load restaurants', err);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleSearch(query) {
    setSearchQuery(query);
    if (restRef.current) restRef.current.scrollIntoView({ behavior: 'smooth' });
    try {
      const res = await fetch(`/api/restaurants?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setRestaurants(data.restaurants);
    } catch {}
  }

  const cuisines = [...new Set(restaurants.flatMap(r => r.cuisine.split(', ')))];

  return (
    <div>
      <Hero onSearch={handleSearch} />

      <motion.div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
        <div className="glass rounded-2xl p-4 md:p-6">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <motion.div className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-amber-50 text-primary px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-sm" whileHover={{ scale: 1.02 }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              New York
            </motion.div>
            <div className="h-6 w-px bg-gray-200" />
            {cuisines.slice(0, 8).map((c, i) => (
              <motion.button key={c} onClick={() => handleSearch(c)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-primary bg-gray-100 hover:bg-orange-100 rounded-full transition-all whitespace-nowrap font-medium">
                {c}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {featured.length > 0 && (
        <motion.section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Featured Restaurants</h2>
              <p className="text-gray-500 text-sm mt-1">Hand-picked by our editors</p>
            </div>
            <motion.button className="text-primary font-medium text-sm flex items-center gap-1" whileHover={{ x: 3 }}>
              View All <span>→</span>
            </motion.button>
          </div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {featured.slice(0, 4).map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} onClick={onRestaurantClick} index={i} />
            ))}
          </motion.div>
        </motion.section>
      )}

      <section ref={restRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-16">
        <motion.div className="flex items-center justify-between mb-6" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Restaurants'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {loading ? 'Loading...' : `${restaurants.length} ${restaurants.length === 1 ? 'restaurant' : 'restaurants'} near you`}
            </p>
          </div>
          {searchQuery && (
            <motion.button onClick={() => handleSearch('')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition">
              Clear
            </motion.button>
          )}
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : restaurants.length === 0 ? (
          <motion.div className="text-center py-16" variants={fadeIn} initial="hidden" animate="visible">
            <motion.span className="text-5xl block mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>🔍</motion.span>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Try a different search term</p>
          </motion.div>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" variants={stagger} initial="hidden" animate="visible">
            {restaurants.map((r, i) => (
              <RestaurantCard key={r.id} restaurant={r} onClick={onRestaurantClick} index={i} />
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
}
