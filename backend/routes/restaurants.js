const express = require('express');
const router = express.Router();
const restaurants = require('../data/restaurants');
const { authMiddleware } = require('../middleware/auth');

const reviews = {};
const favorites = {};

router.get('/', (req, res) => {
  let { search, cuisine, sort } = req.query;
  let result = [...restaurants];
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.menu.some(m => m.name.toLowerCase().includes(q))
    );
  }
  if (cuisine) result = result.filter(r => r.cuisine.toLowerCase().includes(cuisine.toLowerCase()));
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  else if (sort === 'delivery') result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
  else if (sort === 'popular') result.sort((a, b) => (b.orderCount || 0) - (a.orderCount || 0));
  res.json({ restaurants: result, total: result.length });
});

router.get('/featured', (req, res) => {
  const featured = restaurants.filter(r => r.featured);
  res.json({ restaurants: featured });
});

router.get('/cuisines', (req, res) => {
  const cuisineSet = new Set();
  restaurants.forEach(r => r.cuisine.split(', ').forEach(c => cuisineSet.add(c)));
  res.json({ cuisines: Array.from(cuisineSet).sort() });
});

router.get('/:id', (req, res) => {
  const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
  const restReviews = reviews[restaurant.id] || [];
  const avgRating = restReviews.length ? (restReviews.reduce((s, r) => s + r.rating, 0) / restReviews.length).toFixed(1) : restaurant.rating;
  res.json({ restaurant: { ...restaurant, userReviews: restReviews, avgRating: parseFloat(avgRating) } });
});

router.post('/:id/reviews', authMiddleware, (req, res) => {
  const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });
  if (!reviews[restaurant.id]) reviews[restaurant.id] = [];
  reviews[restaurant.id].push({
    id: Date.now(),
    userId: req.user.id,
    userName: req.user.name,
    rating, comment: comment || '',
    createdAt: new Date().toISOString()
  });
  const avgRating = (reviews[restaurant.id].reduce((s, r) => s + r.rating, 0) / reviews[restaurant.id].length).toFixed(1);
  res.json({ reviews: reviews[restaurant.id], avgRating: parseFloat(avgRating) });
});

router.get('/:id/reviews', (req, res) => {
  res.json({ reviews: reviews[parseInt(req.params.id)] || [] });
});

router.post('/favorites/toggle', authMiddleware, (req, res) => {
  if (!favorites[req.user.id]) favorites[req.user.id] = [];
  const { restaurantId } = req.body;
  const idx = favorites[req.user.id].indexOf(restaurantId);
  if (idx > -1) favorites[req.user.id].splice(idx, 1);
  else favorites[req.user.id].push(restaurantId);
  res.json({ favorites: favorites[req.user.id] });
});

router.get('/favorites/list', authMiddleware, (req, res) => {
  const ids = favorites[req.user.id] || [];
  const favRests = restaurants.filter(r => ids.includes(r.id));
  res.json({ favorites: favRests });
});

module.exports = router;
