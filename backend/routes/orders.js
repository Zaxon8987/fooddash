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
  const now = Date.now();
  const order = {
    id: uuidv4().slice(0, 10).toUpperCase(),
    userId: req.user.id,
    restaurantId,
    items,
    deliveryAddress,
    paymentMethod: paymentMethod || { type: 'Cash on Delivery' },
    note: note || '',
    subtotal, deliveryFee, tax, total,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(now + 30 * 60000).toISOString(),
    statusTimeline: [
      { status: 'confirmed', time: new Date().toISOString(), label: 'Order Confirmed' },
      { status: 'preparing', time: new Date(now + 5 * 60000).toISOString(), label: 'Preparing your food' },
      { status: 'delivering', time: new Date(now + 15 * 60000).toISOString(), label: 'Out for delivery' },
      { status: 'delivered', time: new Date(now + 30 * 60000).toISOString(), label: 'Delivered' },
    ]
  };
  orders.unshift(order);
  req.user.points = (req.user.points || 0) + Math.floor(total);
  const restaurants = require('../data/restaurants');
  const rest = restaurants.find(r => r.id === restaurantId);
  if (rest) rest.orderCount = (rest.orderCount || 0) + 1;
  res.status(201).json({ order });
});

router.get('/', authMiddleware, (req, res) => {
  let userOrders = orders.filter(o => o.userId === req.user.id);
  const { status: filterStatus } = req.query;
  if (filterStatus) userOrders = userOrders.filter(o => o.status === filterStatus);
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
  const restaurants = require('../data/restaurants');
  const rest = restaurants.find(r => r.id === order.restaurantId);
  res.json({ order: { ...order, restaurantName: rest?.name, restaurantImage: rest?.image } });
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
