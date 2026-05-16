import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { stagger, fadeUp, scaleIn } from '../lib/animations';

const STATUS_ICONS = { confirmed: '✅', preparing: '👨‍🍳', delivering: '🛵', delivered: '🎉', cancelled: '❌' };

export default function OrderTracking({ onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { token } = useAuth();

  useEffect(() => { loadOrders(); }, [filter]);

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

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-32 animate-shimmer rounded-2xl" />)}
    </div>
  );

  const filters = ['', 'confirmed', 'preparing', 'delivering', 'delivered', 'cancelled'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div className="flex items-center gap-4 mb-6" variants={fadeUp} initial="hidden" animate="visible">
        <motion.button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition" whileHover={{ x: -2 }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </motion.button>
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
      </motion.div>

      <motion.div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-6" variants={fadeUp} initial="hidden" animate="visible">
        {filters.map(f => (
          <motion.button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${filter === f ? 'bg-primary text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {f || 'All'}
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {orders.length === 0 ? (
          <motion.div key="empty" className="text-center py-16 text-gray-500" variants={fadeUp} initial="hidden" animate="visible">
            <motion.span className="text-5xl block mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>📋</motion.span>
            <p className="font-bold text-gray-800 mb-1">No orders yet</p>
            <p className="text-sm">Your orders will appear here</p>
          </motion.div>
        ) : (
          <motion.div key="orders" className="space-y-4" variants={stagger} initial="hidden" animate="visible">
            {orders.map(order => (
              <motion.div key={order.id} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm card-hover">
                <div className="p-4 md:p-6">
                  <div className="flex items-start gap-4">
                    {order.restaurantImage && (
                      <motion.img src={order.restaurantImage} alt="" className="w-16 h-16 rounded-xl object-cover" whileHover={{ scale: 1.05 }} />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-gray-800">{order.restaurantName}</h3>
                          <p className="text-sm text-gray-500">#{order.id}</p>
                        </div>
                        <motion.span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-orange-100 text-orange-600'
                        }`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </motion.span>
                      </div>
                      <motion.div className="flex flex-wrap gap-2 mt-3 text-sm text-gray-500" variants={stagger} initial="hidden" animate="visible">
                        <motion.span variants={fadeUp}>{order.items.length} items</motion.span>
                        <motion.span variants={fadeUp}>${order.total.toFixed(2)}</motion.span>
                        <motion.span variants={fadeUp}>{new Date(order.createdAt).toLocaleDateString()}</motion.span>
                      </motion.div>

                      {order.statusTimeline && order.status !== 'cancelled' && (
                        <motion.div className="mt-4" variants={scaleIn} initial="hidden" animate="visible">
                          <div className="flex items-center gap-0">
                            {order.statusTimeline.map((step, i) => {
                              const statusOrder = ['confirmed', 'preparing', 'delivering', 'delivered'];
                              const completed = statusOrder.indexOf(order.status) >= i;
                              const last = i === order.statusTimeline.length - 1;
                              return (
                                <div key={step.status} className={`flex items-center ${last ? '' : 'flex-1'}`}>
                                  <motion.div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${completed ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'}`}
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}>
                                    {STATUS_ICONS[step.status] || i + 1}
                                  </motion.div>
                                  {!last && <motion.div className={`flex-1 h-0.5 ${completed ? 'bg-primary' : 'bg-gray-200'}`} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: i * 0.1 + 0.1 }} style={{ transformOrigin: 'left' }} />}
                                </div>
                              );
                            })}
                          </div>
                          <div className="flex justify-between mt-1 text-xs text-gray-400">
                            {order.statusTimeline.map(s => <span key={s.status}>{s.label}</span>)}
                          </div>
                        </motion.div>
                      )}

                      {order.status === 'confirmed' && (
                        <motion.button onClick={() => cancelOrder(order.id)} className="mt-3 text-sm text-red-500 hover:text-red-600 font-medium"
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          Cancel Order
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
