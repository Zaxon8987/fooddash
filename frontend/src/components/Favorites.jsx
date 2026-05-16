import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import RestaurantCard from './RestaurantCard';

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

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
        <h1 className="text-2xl font-bold text-gray-800">My Favorites</h1>
      </div>
      {favorites.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><span className="text-5xl block mb-4">❤️</span><p className="font-bold text-gray-800 mb-1">No favorites yet</p><p className="text-sm">Save your favorite restaurants here</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(r => <RestaurantCard key={r.id} restaurant={r} onClick={onRestaurantClick} />)}
        </div>
      )}
    </div>
  );
}
