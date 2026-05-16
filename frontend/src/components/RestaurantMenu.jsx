import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

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
        if (data.restaurant?.menu?.length) {
          setActiveCategory(data.restaurant.menu[0].category);
        }
      })
      .finally(() => setLoading(false));
  }, [restaurantId]);

  function getItemQuantity(itemId) {
    const item = cartItems.find(i => i.id === itemId);
    return item ? item.quantity : 0;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return <div className="text-center py-20 text-gray-500">Restaurant not found</div>;
  }

  const categories = [...new Set(restaurant.menu.map(i => i.category))];

  return (
    <div>
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <button onClick={onBack} className="text-white/80 hover:text-white mb-3 flex items-center gap-1.5 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to restaurants
          </button>
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-white/80 text-sm">
            <span className="flex items-center gap-1 bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {restaurant.rating}
            </span>
            <span>{restaurant.deliveryTime} min</span>
            <span>{restaurant.cuisine}</span>
            <span>${restaurant.deliveryFee} delivery</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="hidden md:block w-48 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-gray-100 p-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-2">Menu</h3>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition mb-0.5 ${
                    activeCategory === cat
                      ? 'bg-primary text-white font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1">
            {categories.map(cat => {
              const items = restaurant.menu.filter(i => i.category === cat);
              if (cat !== activeCategory) return null;
              return (
                <div key={cat}>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-bold text-gray-800">{cat}</h2>
                    <div className="h-px flex-1 bg-gray-200" />
                    <span className="text-sm text-gray-400">{items.length} items</span>
                  </div>
                  <div className="grid gap-4">
                    {items.map(item => (
                      <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                            <span className="text-primary font-bold ml-2">${item.price}</span>
                          </div>
                          <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                          <div className="flex items-center gap-2">
                            {getItemQuantity(item.id) > 0 ? (
                              <div className="flex items-center gap-2 bg-primary text-white rounded-lg">
                                <button onClick={() => addItem(item, restaurant)} className="px-2.5 py-1.5 hover:bg-primary-dark transition text-sm font-bold">+</button>
                                <span className="text-sm font-bold min-w-[20px] text-center">{getItemQuantity(item.id)}</span>
                                <button onClick={() => removeItem(item.id)} className="px-2.5 py-1.5 hover:bg-primary-dark transition text-sm font-bold">−</button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addItem(item, restaurant)}
                                className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
                              >
                                Add +
                              </button>
                            )}
                            {item.popular && (
                              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">⭐ Popular</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
