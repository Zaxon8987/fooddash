import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { stagger, fadeUp, slideRight, springBounce } from '../lib/animations';

export default function RestaurantMenu({ restaurantId, onBack, onCartClick }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const { addItem, removeItem, cartItems } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/restaurants/${restaurantId}`)
      .then(r => r.json())
      .then(data => {
        setRestaurant(data.restaurant);
        if (data.restaurant?.menu?.length) setActiveCategory(data.restaurant.menu[0].category);
      })
      .finally(() => setLoading(false));
  }, [restaurantId]);

  function getItemQuantity(itemId) {
    const item = cartItems.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-56 md:h-72 animate-shimmer" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            <div className="hidden md:block w-48 space-y-2"><div className="h-10 animate-shimmer rounded-xl" /><div className="h-10 animate-shimmer rounded-xl" /><div className="h-10 animate-shimmer rounded-xl" /></div>
            <div className="flex-1 space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 animate-shimmer rounded-xl" />)}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!restaurant) return <div className="text-center py-20 text-gray-500">Restaurant not found</div>;

  const categories = [...new Set(restaurant.menu.map(i => i.category))];

  return (
    <div>
      <motion.div className="relative h-56 md:h-72 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <motion.img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover"
          initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.5 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <motion.button onClick={onBack} className="text-white/80 hover:text-white mb-3 flex items-center gap-1.5 text-sm"
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} whileHover={{ x: -3 }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to restaurants
          </motion.button>
          <motion.h1 className="text-2xl md:text-4xl font-bold text-white mb-2" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>{restaurant.name}</motion.h1>
          <motion.div className="flex flex-wrap items-center gap-3 text-white/80 text-sm" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <span className="flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              {restaurant.rating}
            </span>
            <span>{restaurant.deliveryTime} min</span>
            <span>{restaurant.cuisine}</span>
            <span>${restaurant.deliveryFee} delivery</span>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden md:block w-48 flex-shrink-0">
            <motion.div className="sticky top-24 bg-white/90 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 p-3"
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Menu</h3>
              {categories.map(cat => (
                <motion.button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition mb-0.5 ${activeCategory === cat ? 'bg-primary text-white font-medium shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                  whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                  {cat}
                </motion.button>
              ))}
            </motion.div>
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              {categories.map(cat => {
                const items = restaurant.menu.filter(i => i.category === cat);
                if (cat !== activeCategory) return null;
                return (
                  <motion.div key={cat} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-xl font-bold text-gray-800">{cat}</h2>
                      <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
                      <span className="text-sm text-gray-400">{items.length} items</span>
                    </div>
                    <motion.div className="grid gap-4" variants={stagger} initial="hidden" animate="visible">
                      {items.map(item => (
                        <motion.div key={item.id} variants={slideRight} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 flex gap-4 card-hover">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-1">
                              <h3 className="font-bold text-gray-800">{item.name}</h3>
                              <span className="text-primary font-bold ml-2">${item.price}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                            <div className="flex items-center gap-2">
                              {getItemQuantity(item.id) > 0 ? (
                                <motion.div className="flex items-center gap-2 bg-primary text-white rounded-lg" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                                  <motion.button onClick={() => addItem(item, restaurant)} className="px-2.5 py-1.5 hover:bg-primary-dark transition text-sm font-bold"
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>+</motion.button>
                                  <span className="text-sm font-bold min-w-[20px] text-center">{getItemQuantity(item.id)}</span>
                                  <motion.button onClick={() => removeItem(item.id)} className="px-2.5 py-1.5 hover:bg-primary-dark transition text-sm font-bold"
                                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>−</motion.button>
                                </motion.div>
                              ) : (
                                <motion.button onClick={() => addItem(item, restaurant)} className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  Add +
                                </motion.button>
                              )}
                              {item.popular && (
                                <motion.span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium"
                                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={springBounce}>
                                  ⭐ Popular
                                </motion.span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
