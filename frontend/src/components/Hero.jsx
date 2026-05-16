import { useState } from 'react';
import { motion } from 'framer-motion';
import { stagger, fadeUp, fadeDown, scaleIn } from '../lib/animations';

const floatingItems = [
  { emoji: '🍕', x: '15%', y: '20%', delay: 0, size: 'text-3xl' },
  { emoji: '🍔', x: '85%', y: '15%', delay: 1.2, size: 'text-2xl' },
  { emoji: '🌮', x: '10%', y: '65%', delay: 2.4, size: 'text-2xl' },
  { emoji: '🍜', x: '88%', y: '70%', delay: 0.8, size: 'text-3xl' },
  { emoji: '🥗', x: '50%', y: '10%', delay: 1.8, size: 'text-xl' },
  { emoji: '🍰', x: '75%', y: '80%', delay: 3.0, size: 'text-2xl' },
  { emoji: '🍣', x: '22%', y: '82%', delay: 1.5, size: 'text-xl' },
  { emoji: '🥘', x: '92%', y: '40%', delay: 2.0, size: 'text-lg' },
];

export default function Hero({ onSearch }) {
  const [query, setQuery] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onSearch?.(query);
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 min-h-[520px] flex items-center">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920')] bg-cover bg-center opacity-[0.04]" />

      {floatingItems.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.size} pointer-events-none select-none`}
          style={{ left: item.x, top: item.y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.15, y: [0, -12, 0] }}
          transition={{ opacity: { delay: item.delay, duration: 1 }, y: { delay: item.delay, duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
        >
          {item.emoji}
        </motion.div>
      ))}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative w-full">
        <motion.div className="max-w-3xl mx-auto text-center" variants={stagger} initial="hidden" animate="visible">
          <motion.div variants={fadeDown} className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6 shadow-sm">
            <motion.span className="w-2 h-2 bg-primary rounded-full" animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }} transition={{ duration: 2, repeat: Infinity }} />
            Delivering to your area
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold text-gray-900 mb-4 leading-[1.1] tracking-tight">
            Your favorite food,
            <span className="gradient-text block mt-1"> delivered fast</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            From local restaurants to your doorstep. Order now and
            <span className="text-gray-700 font-medium"> track your delivery</span> in real-time.
          </motion.p>

          <motion.form variants={scaleIn} onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <div className="flex items-center bg-white rounded-full shadow-lg shadow-primary-glow border border-orange-100 p-1.5 group focus-within:border-primary focus-within:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-2 pl-4 flex-1">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text" value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Search for restaurants or cuisines..."
                  className="w-full py-2.5 text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none text-base"
                />
              </div>
              <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="bg-primary hover:bg-primary-dark text-white px-7 py-2.5 rounded-full font-medium transition text-sm shadow-sm shadow-orange-200">
                Search
              </motion.button>
            </div>
          </motion.form>

          <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-400">
            {[
              { icon: 'M5 13l4 4L19 7', label: '30 min delivery' },
              { icon: 'M5 13l4 4L19 7', label: 'No minimum order' },
              { icon: 'M5 13l4 4L19 7', label: 'Real-time tracking' },
            ].map((item, i) => (
              <motion.span key={i} className="flex items-center gap-1.5" whileHover={{ color: '#ff6b35' }}>
                <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                </svg>
                {item.label}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
