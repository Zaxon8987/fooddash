import { motion } from 'framer-motion';
import { stagger, fadeUp } from '../lib/animations';

const socialLinks = [
  { icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z', label: 'Twitter' },
  { icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', label: 'Instagram' },
];

export default function Footer() {
  return (
    <motion.footer className="bg-gray-900 text-gray-300 mt-16 relative overflow-hidden"
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-8" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.div variants={fadeUp}>
            <motion.div className="flex items-center gap-2 mb-4" whileHover={{ x: 3 }}>
              <motion.span className="text-2xl" animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>🍕</motion.span>
              <span className="text-xl font-bold text-white">FoodDash</span>
            </motion.div>
            <p className="text-sm text-gray-400">Your favorite food, delivered fast. Order from the best local restaurants.</p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['Home', 'Browse Restaurants', 'My Orders', 'About Us'].map(link => (
                <motion.li key={link} whileHover={{ x: 3 }}>
                  <a href="#" className="hover:text-primary transition-colors">{link}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'].map(link => (
                <motion.li key={link} whileHover={{ x: 3 }}>
                  <a href="#" className="hover:text-primary transition-colors">{link}</a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp}>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Download</h4>
            <ul className="space-y-2 text-sm">
              {['iOS App', 'Android App'].map(link => (
                <motion.li key={link} whileHover={{ x: 3 }}>
                  <a href="#" className="hover:text-primary transition-colors">{link}</a>
                </motion.li>
              ))}
            </ul>
            <div className="flex gap-3 mt-4">
              {socialLinks.map(s => (
                <motion.a key={s.label} href="#" className="w-8 h-8 bg-gray-700/50 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                  whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          © 2026 FoodDash. All rights reserved.
        </motion.div>
      </div>
    </motion.footer>
  );
}
