import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const STATUS_ICONS = {
  confirmed: '✅', preparing: '👨‍🍳', delivering: '🛵', delivered: '🎉', cancelled: '❌'
};

export default function OrderTracking({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    loadOrders();
  }, [filter]);

  async function loadOrders() {
    const url = filter ? `/api/orders?status=${filter}` : '/api/orders';
    const res = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    setOrders(data.orders);
    setLoading(false);
  }

  async function cancelOrder(id) {
    await fetch(`/api/orders/${id}/cancel`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } });
    loadOrders();
  }

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const filters = ['', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === f ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f || 'All'}
          </button>
        ))}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500"><span className="text-5xl block mb-4">📋</span><p className="font-bold text-gray-800 mb-1">No orders yet</p><p className="text-sm">Your orders will appear here</p></div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="p-4 md:p-6">
                <div className="flex items-start gap-4">
                  {order.restaurantImage && <img src={order.restaurantImage} alt="" className="w-16 h-16 rounded-xl object-cover" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-800">{order.restaurantName}</h3>
                        <p className="text-sm text-gray-500">#{order.id}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-orange-100 text-orange-600'
                      }`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-500">
                      <span>{order.items.length} items</span>
                      <span>${order.total.toFixed(2)}</span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>

                    {order.statusTimeline && order.status !== 'cancelled' && (
                      <div className="mt-4">
                        <div className="flex items-center gap-0">
                          {order.statusTimeline.map((step, i) => {
                            const completed = ['confirmed', 'preparing', 'delivering', 'delivered'].indexOf(order.status) >= i;
                            const current = ['confirmed', 'preparing', 'delivering', 'delivered'].indexOf(order.status) === i;
                            const last = i === order.statusTimeline.length - 1;
                            return (
                              <div key={step.status} className={`flex items-center ${last ? '' : 'flex-1'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${completed ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}>
                                  {STATUS_ICONS[step.status] || i + 1}
                                </div>
                                {!last && <div className={`flex-1 h-0.5 ${completed ? 'bg-primary' : 'bg-gray-200'}`} />}
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-gray-400">
                          {order.statusTimeline.map(s => <span key={s.status}>{s.label}</span>)}
                        </div>
                      </div>
                    )}

                    {order.status === 'confirmed' && (
                      <button onClick={() => cancelOrder(order.id)} className="mt-3 text-sm text-red-500 hover:text-red-600 font-medium">Cancel Order</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
