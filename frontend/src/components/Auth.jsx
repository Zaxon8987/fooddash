import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { stagger, fadeUp } from '../lib/animations';

export default function Auth({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await signup(form.name, form.email, form.password, form.phone);
      onClose();
    } catch (err) { setError(err.message); }
    setLoading(false);
  }

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <motion.div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div className="relative bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
        <motion.button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg transition"
          whileHover={{ rotate: 90, scale: 1.1 }}>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>

        <motion.div className="text-center mb-6" variants={stagger} initial="hidden" animate="visible">
          <motion.span className="text-4xl block mb-2" variants={fadeUp} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>🍕</motion.span>
          <motion.h2 className="text-2xl font-bold text-gray-800" variants={fadeUp}>{isLogin ? 'Welcome Back' : 'Create Account'}</motion.h2>
          <motion.p className="text-gray-500 text-sm mt-1" variants={fadeUp}>
            {isLogin ? 'Sign in to continue ordering' : 'Start ordering your favorite food'}
          </motion.p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm mb-4 flex items-center gap-2"
              initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }}>
              <span>⚠️</span> {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form onSubmit={handleSubmit} className="space-y-4" variants={stagger} initial="hidden" animate="visible">
          {!isLogin && (
            <motion.div variants={fadeUp}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="John Doe" required />
            </motion.div>
          )}
          <motion.div variants={fadeUp}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="you@example.com" required />
          </motion.div>
          <motion.div variants={fadeUp}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="••••••••" minLength={6} required />
          </motion.div>
          {!isLogin && (
            <motion.div variants={fadeUp}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400 font-normal">(optional)</span></label>
              <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm" placeholder="+1 555-0123" />
            </motion.div>
          )}
          <motion.button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary disabled:from-gray-300 disabled:to-gray-300 text-white py-3 rounded-xl font-bold transition shadow-sm shadow-orange-200 flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {loading ? <><motion.div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} /> Loading...</> : isLogin ? 'Sign In' : 'Create Account'}
          </motion.button>
        </motion.form>

        <motion.div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? (
            <>Don't have an account?{' '}
              <motion.button onClick={() => setIsLogin(false)} className="text-primary font-medium hover:underline" whileHover={{ scale: 1.02 }}>Sign up</motion.button>
            </>
          ) : (
            <>Already have an account?{' '}
              <motion.button onClick={() => setIsLogin(true)} className="text-primary font-medium hover:underline" whileHover={{ scale: 1.02 }}>Sign in</motion.button>
            </>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
