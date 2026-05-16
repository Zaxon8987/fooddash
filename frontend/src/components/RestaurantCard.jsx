export default function RestaurantCard({ restaurant, onClick }) {
  return (
    <div
      onClick={() => onClick?.(restaurant)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-sm font-medium text-gray-700 shadow-sm">
          {restaurant.deliveryTime} min
        </div>
        {restaurant.featured && (
          <div className="absolute top-3 right-3 bg-primary text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
            FEATURED
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary transition line-clamp-1">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-lg text-sm font-bold">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {restaurant.rating}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-3">{restaurant.cuisine}</p>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {restaurant.distance}
          </span>
          <span>${restaurant.deliveryFee} delivery</span>
        </div>
      </div>
    </div>
  );
}
