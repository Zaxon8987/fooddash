const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

const orders = [];

router.post('/', authMiddleware, (req, res) => {
  const { restaurantId, items, deliveryAddress, paymentMethod, note } = req.body;
  if (!restaurantId || !items || !items.length || !deliveryAddress) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 2.99;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + deliveryFee + tax).toFixed(2));
  const order = {
    id: uuidv4(),
    userId: req.user.id,
    restaurantId,
    items,
    deliveryAddress,
    paymentMethod: paymentMethod || { type: 'cash' },
    note: note || '',
    subtotal,
    deliveryFee,
    tax,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString()
  };
  orders.unshift(order);
  res.status(201).json({ order });
});

router.get('/', authMiddleware, (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id);
  const restaurants = require('../data/restaurants');
  const enriched = userOrders.map(o => {
    const rest = restaurants.find(r => r.id === o.restaurantId);
    return { ...o, restaurantName: rest?.name || 'Unknown', restaurantImage: rest?.image || '' };
  });
  res.json({ orders: enriched });
});

router.get('/:id', authMiddleware, (req, res) => {
  const order = orders.find(o => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

router.put('/:id/cancel', authMiddleware, (req, res) => {
  const order = orders.find(o => o.id === req.params.id && o.userId === req.user.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.status !== 'confirmed') {
    return res.status(400).json({ error: 'Order cannot be cancelled' });
  }
  order.status = 'cancelled';
  res.json({ order });
});

module.exports = router;
