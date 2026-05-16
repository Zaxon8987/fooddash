import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
      <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition mb-4"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">{user?.name?.[0]}</div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100">
          <span className="text-2xl block mb-2">⭐</span>
          <p className="text-2xl font-bold text-gray-800">{user?.points || 0}</p>
          <p className="text-sm text-gray-500">Loyalty Points</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
          <span className="text-2xl block mb-2">📋</span>
          <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
          <span className="text-2xl block mb-2">🎁</span>
          <p className="text-sm font-bold text-gray-800 mb-1">Referral Code</p>
          <p className="text-lg font-mono font-bold text-primary">{user?.referralCode || '—'}</p>
          <button onClick={async () => { await claimReferral(); alert('100 bonus points claimed!'); }}
            className="mt-2 text-xs bg-primary text-white px-3 py-1 rounded-full font-medium">Claim 100 pts</button>
        </div>
      </div>

      {user?.addresses && user.addresses.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Saved Addresses</h2>
            <button onClick={() => setShowAddr(!showAddr)} className="text-sm text-primary font-medium">+ Add</button>
          </div>
          <div className="space-y-2">
            {user.addresses.map(a => (
              <div key={a.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                <span className="text-lg">{a.label === 'Home' ? '🏠' : '🏢'}</span>
                <div><p className="text-sm font-medium text-gray-700">{a.street}, {a.city}</p><p className="text-xs text-gray-400">{a.zip}</p></div>
              </div>
            ))}
          </div>
          {showAddr && (
            <form onSubmit={handleAddAddress} className="mt-4 space-y-2">
              <input placeholder="Street" value={addrForm.street} onChange={e => setAddrForm({...addrForm, street: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"/>
              <div className="flex gap-2">
                <input placeholder="City" value={addrForm.city} onChange={e => setAddrForm({...addrForm, city: e.target.value})} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"/>
                <input placeholder="ZIP" value={addrForm.zip} onChange={e => setAddrForm({...addrForm, zip: e.target.value})} className="w-32 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"/>
              </div>
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium">Save Address</button>
            </form>
          )}
        </div>
      )}

      {recentOrders.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Recent Orders</h2>
            <button onClick={onViewOrders} className="text-sm text-primary font-medium">View All</button>
          </div>
          <div className="space-y-2">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div><p className="text-sm font-medium text-gray-700">{o.restaurantName}</p><p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString()}</p></div>
                <span className="text-sm font-bold text-gray-800">${o.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
