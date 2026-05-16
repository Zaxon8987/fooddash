const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { generateToken, authMiddleware } = require('../middleware/auth');
const users = require('../data/users');
const { v4: uuidv4 } = require('uuid');

function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password required' });
    if (findUserByEmail(email)) return res.status(400).json({ error: 'Email already registered' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1, name, email, password: hashedPassword, phone: phone || '',
      addresses: [], paymentMethods: [], points: 0, referralCode: uuidv4().slice(0, 6).toUpperCase()
    };
    users.push(newUser);
    const token = generateToken(newUser);
    res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, points: 0, referralCode: newUser.referralCode } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = findUserByEmail(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.password.startsWith('$2a$')) {
      if (!(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
    } else if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses, paymentMethods: user.paymentMethods, points: user.points || 0, referralCode: user.referralCode } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses, paymentMethods: user.paymentMethods, points: user.points || 0, referralCode: user.referralCode } });
});

router.put('/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (req.body.name) user.name = req.body.name;
  if (req.body.phone) user.phone = req.body.phone;
  res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses, paymentMethods: user.paymentMethods, points: user.points || 0 } });
});

router.post('/addresses', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  const { street, city, zip, label } = req.body;
  if (!street || !city || !zip) return res.status(400).json({ error: 'Street, city, and zip required' });
  const addr = { id: uuidv4().slice(0, 8), street, city, zip, label: label || 'Home' };
  if (!user.addresses) user.addresses = [];
  user.addresses.push(addr);
  res.json({ addresses: user.addresses });
});

router.delete('/addresses/:id', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  user.addresses = (user.addresses || []).filter(a => a.id !== req.params.id);
  res.json({ addresses: user.addresses });
});

router.get('/referral/claim', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  user.points = (user.points || 0) + 100;
  res.json({ points: user.points, message: '100 bonus points claimed!' });
});

module.exports = router;
