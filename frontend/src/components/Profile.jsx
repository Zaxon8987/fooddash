import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { stagger, fadeUp, scaleIn } from '../lib/animations';

export default function Profile({ onBack, onViewOrders }) {
  const { user, addAddress, claimReferral } = useAuth();
  const [orders, setOrders] = useState([]);
  const [showAddr, setShowAddr] = useState(false);
  const [addrForm, setAddrForm] = useState({ street: '', city: '', zip: '', label: 'Home' });

  useEffect(() => {
    fetch('/api/orders', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      .then(r => r.json()).then(d => setOrders(d.orders || [])).catch(() => {});
  }, []);

  async function handleAddAddress(e) {
    e.preventDefault();
    await addAddress(addrForm);
    setAddrForm({ street: '', city: '', zip: '', label: 'Home' });
    setShowAddr(false);
  }

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition mb-4" whileHover={{ x: -2 }}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </motion.button>

      <motion.div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm" variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-4">
          <motion.div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md"
            whileHover={{ scale: 1.05 }}>{user?.name?.[0]}</motion.div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" variants={stagger} initial="hidden" animate="visible">
        {[
          { gradient: 'from-orange-50 to-amber-50', border: 'border-orange-100', icon: '⭐', value: `${user?.points || 0}`, label: 'Loyalty Points' },
          { gradient: 'from-blue-50 to-indigo-50', border: 'border-blue-100', icon: '📋', value: `${orders.length}`, label: 'Total Orders' },
          { gradient: 'from-green-50 to-emerald-50', border: 'border-green-100', icon: '🎁', value: user?.referralCode || '—', label: 'Referral Code', isCode: true },
        ].map((stat, i) => (
          <motion.div key={i} variants={scaleIn} whileHover={{ y: -2 }} className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 border ${stat.border}`}>
            <span className="text-2xl block mb-2">{stat.icon}</span>
            {stat.isCode ? (
              <>
                <p className="text-sm font-bold text-gray-800 mb-1">{stat.label}</p>
                <p className="text-lg font-mono font-bold text-primary tracking-wider">{stat.value}</p>
                <motion.button onClick={async () => { await claimReferral(); alert('100 bonus points claimed!'); }}
                  className="mt-2 text-xs bg-primary text-white px-3 py-1 rounded-full font-medium inline-block" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  Claim 100 pts
                </motion.button>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </>
            )}
          </motion.div>
        ))}
      </motion.div>

      {user?.addresses && user.addresses.length > 0 && (
        <motion.div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Saved Addresses</h2>
            <motion.button onClick={() => setShowAddr(!showAddr)} className="text-sm text-primary font-medium" whileHover={{ scale: 1.05 }}>+ Add</motion.button>
          </div>
          <motion.div className="space-y-2" variants={stagger} initial="hidden" animate="visible">
            {user.addresses.map(a => (
              <motion.div key={a.id} variants={fadeUp} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <span className="text-lg">{a.label === 'Home' ? '🏠' : '🏢'}</span>
                <div><p className="text-sm font-medium text-gray-700">{a.street}, {a.city}</p><p className="text-xs text-gray-400">{a.zip}</p></div>
              </motion.div>
            ))}
          </motion.div>
          <AnimatePresence>
            {showAddr && (
              <motion.form onSubmit={handleAddAddress} className="mt-4 space-y-2" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <input placeholder="Street" value={addrForm.street} onChange={e => setAddrForm({...addrForm, street: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition" required />
                <div className="flex gap-2">
                  <input placeholder="City" value={addrForm.city} onChange={e => setAddrForm({...addrForm, city: e.target.value})} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition" required />
                  <input placeholder="ZIP" value={addrForm.zip} onChange={e => setAddrForm({...addrForm, zip: e.target.value})} className="w-32 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition" required />
                </div>
                <motion.button type="submit" className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Save Address</motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {recentOrders.length > 0 && (
        <motion.div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <motion.button onClick={onViewOrders} className="text-sm text-primary font-medium" whileHover={{ x: 2 }}>View All</motion.button>
          </div>
          <motion.div className="space-y-2" variants={stagger} initial="hidden" animate="visible">
            {recentOrders.map(o => (
              <motion.div key={o.id} variants={fadeUp} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div><p className="text-sm font-medium text-gray-700">{o.restaurantName}</p><p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p></div>
                <span className="text-sm font-bold text-gray-800">${o.total.toFixed(2)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
