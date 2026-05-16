import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fadeUp } from '../lib/animations';

export default function Cart({ onClose, onCheckout }) {
  const { cartItems, restaurant, updateQuantity, removeItem, subtotal, deliveryFee, tax, total } = useCart();
  const { user } = useAuth();

  return (
    <motion.div className="fixed inset-0 z-50 flex"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <motion.div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div className="relative ml-auto w-full max-w-md bg-white/95 backdrop-blur-md h-full shadow-2xl flex flex-col"
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
            {restaurant && <p className="text-sm text-gray-500">{restaurant.name}</p>}
          </div>
          <motion.button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition" whileHover={{ rotate: 90 }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </motion.button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 px-4">
            <motion.span className="text-6xl mb-4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>🛒</motion.span>
            <p className="font-bold text-gray-800 mb-1">Your cart is empty</p>
            <p className="text-sm">Add items from a restaurant to get started</p>
          </div>
        ) : (
          <>
            <motion.div className="flex-1 overflow-y-auto p-4 space-y-3" variants={{ visible: { transition: { staggerChildren: 0.06 } } }} initial="visible" animate="visible">
              <AnimatePresence>
                {cartItems.map(item => (
                  <motion.div key={item.id} variants={fadeUp} exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0, padding: 0 }} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 overflow-hidden">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                      <motion.p className="text-sm font-bold text-primary"
                        key={item.quantity}
                        initial={{ scale: 1.3, color: '#ff6b35' }}
                        animate={{ scale: 1, color: '#ff6b35' }}
                        transition={{ duration: 0.2 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </motion.p>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition text-sm font-bold"
                        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>−</motion.button>
                      <motion.span className="w-6 text-center font-medium text-sm" key={item.quantity} initial={{ scale: 1.3 }} animate={{ scale: 1 }}>{item.quantity}</motion.span>
                      <motion.button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition text-sm font-bold"
                        whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>+</motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <motion.div className="border-t border-gray-100 p-4 space-y-3 bg-white" initial={{ y: 20 }} animate={{ y: 0 }}>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-500"><span>Subtotal</span><motion.span key={subtotal} initial={{ scale: 1.2 }} animate={{ scale: 1 }}>${subtotal.toFixed(2)}</motion.span></div>
                <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between text-gray-500"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100"><span>Total</span><motion.span className="text-primary" key={total} initial={{ scale: 1.3 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>${total.toFixed(2)}</motion.span></div>
              </div>
              <motion.button onClick={() => { user ? onCheckout?.() : alert('Please sign in to checkout'); }}
                className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white py-3 rounded-xl font-bold transition shadow-sm shadow-orange-200"
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                {user ? `Proceed to Checkout • $${total.toFixed(2)}` : 'Sign in to Checkout'}
              </motion.button>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
