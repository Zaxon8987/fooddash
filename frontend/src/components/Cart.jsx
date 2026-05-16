import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart({ onClose, onCheckout }) {
  const { cartItems, restaurant, updateQuantity, removeItem, subtotal, deliveryFee, tax, total } = useCart();
  const { user } = useAuth();

  if (cartItems.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 px-4">
            <span className="text-6xl mb-4">🛒</span>
            <p className="font-bold text-gray-800 mb-1">Your cart is empty</p>
            <p className="text-sm">Add items from a restaurant to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
            {restaurant && <p className="text-sm text-gray-500">{restaurant.name}</p>}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                <p className="text-sm font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition text-sm font-bold">−</button>
                <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition text-sm font-bold">+</button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 p-4 space-y-3">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100"><span>Total</span><span className="text-primary">${total.toFixed(2)}</span></div>
          </div>
          <button onClick={() => { user ? onCheckout?.() : alert('Please sign in to checkout'); }}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition text-center block shadow-sm shadow-orange-200">
            {user ? `Proceed to Checkout • $${total.toFixed(2)}` : 'Sign in to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
