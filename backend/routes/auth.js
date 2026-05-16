const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { generateToken, authMiddleware } = require('../middleware/auth');
const users = require('../data/users');

function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password required' });
    }
    if (findUserByEmail(email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      addresses: [],
      paymentMethods: []
    };
    users.push(newUser);
    const token = generateToken(newUser);
    res.status(201).json({
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (user.password.startsWith('$2a$')) {
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } else if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, addresses: user.addresses }
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

router.put('/profile', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (req.body.name) user.name = req.body.name;
  if (req.body.phone) user.phone = req.body.phone;
  res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
});

module.exports = router;
