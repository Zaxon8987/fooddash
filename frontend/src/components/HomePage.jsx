import { useState, useEffect, useRef } from 'react';
import Hero from './Hero';
import RestaurantCard from './RestaurantCard';

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
    if (restRef.current) {
      restRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    try {
      const res = await fetch(`/api/restaurants?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setRestaurants(data.restaurants);
    } catch {
      // ignore
    }
  }

  const cuisines = [...new Set(restaurants.flatMap(r => r.cuisine.split(', ')))];

  return (
    <div>
      <Hero onSearch={handleSearch} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6">
          <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 bg-orange-50 text-primary px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              New York
            </div>
            <div className="h-6 w-px bg-gray-200" />
            {cuisines.slice(0, 8).map(c => (
              <button
                key={c}
                onClick={() => handleSearch(c)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-full transition whitespace-nowrap"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Featured Restaurants</h2>
              <p className="text-gray-500 text-sm mt-1">Hand-picked by our editors</p>
            </div>
            <button className="text-primary font-medium text-sm hover:underline">View All →</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.slice(0, 4).map(r => (
              <RestaurantCard key={r.id} restaurant={r} onClick={onRestaurantClick} />
            ))}
          </div>
        </section>
      )}

      <section ref={restRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Restaurants'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {restaurants.length} {restaurants.length === 1 ? 'restaurant' : 'restaurants'} near you
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handleSearch('')} className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition">
              Clear
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No restaurants found</h3>
            <p className="text-gray-500">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {restaurants.map(r => (
              <RestaurantCard key={r.id} restaurant={r} onClick={onRestaurantClick} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
