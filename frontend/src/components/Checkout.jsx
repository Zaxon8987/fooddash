import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout({ onBack, onOrderSuccess }) {
  const { user, token } = useAuth();
  const { cartItems, restaurant, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const [step, setStep] = useState('review');
  const [selectedAddress, setSelectedAddress] = useState(user?.addresses?.[0] || { street: '123 Main St', city: 'New York', zip: '10001' });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [note, setNote] = useState('');
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState(null);

  async function placeOrder() {
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          restaurantId: restaurant?.id,
          items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          deliveryAddress: selectedAddress,
          paymentMethod: { type: paymentMethod },
          note
        })
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        setDone(data.order);
        onOrderSuccess?.(data.order);
      } else alert(data.error || 'Failed to place order');
    } catch { alert('Failed to connect to server'); }
    setPlacing(false);
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-1">Order #{done.id}</p>
        <p className="text-gray-500 mb-6">Estimated delivery: {new Date(done.estimatedDelivery).toLocaleTimeString()}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onBack} className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary-dark transition">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition mb-4"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg></button>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">Delivery Address</h2>
            {user?.addresses?.map(a => (
              <div key={a.id} onClick={() => setSelectedAddress(a)}
                className={`p-3 rounded-xl border-2 cursor-pointer transition mb-2 ${selectedAddress?.id === a.id ? 'border-primary bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <p className="font-medium text-sm text-gray-700">{a.label}</p>
                <p className="text-sm text-gray-500">{a.street}, {a.city} {a.zip}</p>
              </div>
            ))}
            {(!user?.addresses || user.addresses.length === 0) && (
              <div className="p-3 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-600">{selectedAddress.street}, {selectedAddress.city} {selectedAddress.zip}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">Payment Method</h2>
            <div className="space-y-2">
              {['Cash on Delivery', 'Credit Card', 'PayPal'].map(m => (
                <div key={m} onClick={() => setPaymentMethod(m)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition ${paymentMethod === m ? 'border-primary bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <p className="text-sm font-medium text-gray-700">{m}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3">Delivery Note</h2>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Any special instructions for the restaurant..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition resize-none h-20" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm h-fit sticky top-24">
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
          <button onClick={placeOrder} disabled={placing}
            className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition mt-4 flex items-center justify-center gap-2">
            {placing ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing...</> : `Place Order • $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
