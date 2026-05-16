import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { stagger, fadeUp, scaleIn } from '../lib/animations';

export default function Checkout({ onBack, onOrderSuccess }) {
  const { user, token } = useAuth();
  const { cartItems, restaurant, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.[0] || { street: '123 Main St', city: 'New York', zip: '10001' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(null);

  async function placeOrder() {
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          restaurantId: restaurant?.id,
          items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          deliveryAddress: selectedAddress, paymentMethod: { type: paymentMethod }, note
        })
      });
      const data = await res.json();
      if (res.ok) { clearCart(); setDone(data.order); onOrderSuccess?.(data.order); }
      else alert(data.error || 'Failed to place order');
    } catch { alert('Failed to connect to server'); }
    setPlacing(false);
  }

  if (done) {
    return (
      <motion.div className="max-w-lg mx-auto px-4 py-20 text-center" variants={scaleIn} initial="hidden" animate="visible">
        <motion.div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}>
          <motion.svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </motion.svg>
        </motion.div>
        <motion.h2 className="text-2xl font-bold text-gray-800 mb-2" variants={fadeUp}>Order Placed!</motion.h2>
        <motion.p className="text-gray-500 mb-1" variants={fadeUp}>Order #{done.id}</motion.p>
        <motion.p className="text-gray-500 mb-6" variants={fadeUp}>Estimated delivery: {new Date(done.estimatedDelivery).toLocaleTimeString()}</motion.p>
        <motion.button onClick={onBack} className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary-dark transition"
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          Continue Shopping
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition mb-4" whileHover={{ x: -2 }}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
      </motion.button>
      <motion.h1 className="text-2xl font-bold text-gray-800 mb-6" variants={fadeUp} initial="hidden" animate="visible">Checkout</motion.h1>

      <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={stagger} initial="hidden" animate="visible">
        <div className="md:col-span-2 space-y-6">
          <motion.div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm" variants={fadeUp}>
            <h2 className="font-bold text-gray-800 mb-3">Delivery Address</h2>
            {user?.addresses?.map(a => (
              <motion.div key={a.id} onClick={() => setSelectedAddress(a)} whileHover={{ scale: 1.01 }}
                className={`p-3 rounded-xl border-2 cursor-pointer transition mb-2 ${selectedAddress?.id === a.id ? 'border-primary bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <p className="font-medium text-sm text-gray-700">{a.label}</p>
                <p className="text-sm text-gray-500">{a.street}, {a.city} {a.zip}</p>
              </motion.div>
            ))}
            {(!user?.addresses || user.addresses.length === 0) && (
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-600">{selectedAddress.street}, {selectedAddress.city} {selectedAddress.zip}</p>
              </div>
            )}
          </motion.div>

          <motion.div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm" variants={fadeUp}>
            <h2 className="font-bold text-gray-800 mb-3">Payment Method</h2>
            <motion.div className="space-y-2" variants={stagger} initial="hidden" animate="visible">
              {['Cash on Delivery', 'Credit Card', 'PayPal'].map(m => (
                <motion.div key={m} onClick={() => setPaymentMethod(m)} variants={scaleIn}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition ${paymentMethod === m ? 'border-primary bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <p className="text-sm font-medium text-gray-700">{m}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm" variants={fadeUp}>
            <h2 className="font-bold text-gray-800 mb-3">Delivery Note</h2>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any special instructions for the restaurant..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none h-20" />
          </motion.div>
        </div>

        <motion.div className="bg-white/90 backdrop-blur-md rounded-2xl border border-gray-100 p-5 shadow-sm h-fit sticky top-24" variants={fadeUp}>
          <h2 className="font-bold text-gray-800 mb-3">Order Summary</h2>
          {restaurant && <p className="text-sm font-medium text-gray-600 mb-3">{restaurant.name}</p>}
          <div className="space-y-2 text-sm mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between text-gray-600"><span>{item.quantity}x {item.name}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
          </div>
          <motion.button onClick={placeOrder} disabled={placing}
            className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary disabled:from-gray-300 disabled:to-gray-300 text-white py-3 rounded-xl font-bold transition mt-4 flex items-center justify-center gap-2 shadow-sm shadow-orange-200"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {placing ? <><motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} /> Placing...</> : `Place Order • $${total.toFixed(2)}`}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
