import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart({ onClose, onOrderSuccess }) {
  const { cartItems, restaurant, subtotal, deliveryFee, tax, total, addItem, removeItem, clearCart } = useCart();
  const { user, token } = useAuth();
  const [placing, setPlacing] = useState(false);
  const [note, setNote] = useState('');
  const [orderResult, setOrderResult] = useState(null);

  async function placeOrder() {
    if (!user) return;
    setPlacing(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          restaurantId: restaurant?.id,
          items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          deliveryAddress: user.addresses?.[0] || { street: 'Default Address', city: 'New York', zip: '10001' },
          note
        })
      });
      const data = await res.json();
      if (res.ok) {
        setOrderResult(data.order);
        clearCart();
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch {
      alert('Failed to connect to server');
    }
    setPlacing(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {orderResult ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Order Placed!</h3>
            <p className="text-gray-500 mb-1">Order #{orderResult.id?.slice(0, 8)}</p>
            <p className="text-gray-500 mb-6">Estimated delivery: {new Date(orderResult.estimatedDelivery).toLocaleTimeString()}</p>
            <button onClick={onClose} className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary-dark transition">
              Continue Shopping
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <span className="text-6xl mb-4">🛒</span>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add items from a restaurant to get started</p>
            <button onClick={onClose} className="bg-primary text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary-dark transition">
              Browse Restaurants
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4">
            {restaurant && (
              <div className="flex items-center gap-3 bg-orange-50 rounded-xl p-3 mb-4">
                <span className="text-2xl">🍽️</span>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{restaurant.name}</p>
                  <p className="text-xs text-gray-500">{restaurant.deliveryTime} min delivery</p>
                </div>
              </div>
            )}
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-50">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">{item.name}</h4>
                  <p className="text-primary font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-2 py-1">
                    <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-primary text-sm font-bold px-1">−</button>
                    <span className="text-sm font-bold min-w-[16px] text-center text-gray-700">{item.quantity}</span>
                    <button onClick={() => addItem(item, restaurant)} className="text-gray-500 hover:text-primary text-sm font-bold px-1">+</button>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add delivery note..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition"
              />
            </div>
          </div>
        )}

        {cartItems.length > 0 && !orderResult && (
          <div className="border-t border-gray-100 p-4 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-500"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
            </div>
            {user ? (
              <button
                onClick={placeOrder}
                disabled={placing}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                {placing ? (
                  <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
                ) : (
                  <>Place Order • ${total.toFixed(2)}</>
                )}
              </button>
            ) : (
              <p className="text-center text-sm text-gray-500">Sign in to place your order</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
