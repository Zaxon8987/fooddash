const express = require('express');
const router = express.Router();
const restaurants = require('../data/restaurants');

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
  if (cuisine) {
    result = result.filter(r =>
      r.cuisine.toLowerCase().includes(cuisine.toLowerCase())
    );
  }
  if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'delivery') {
    result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime));
  }
  res.json({ restaurants: result, total: result.length });
});

router.get('/featured', (req, res) => {
  const featured = restaurants.filter(r => r.featured);
  res.json({ restaurants: featured });
});

router.get('/cuisines', (req, res) => {
  const cuisineSet = new Set();
  restaurants.forEach(r => {
    r.cuisine.split(', ').forEach(c => cuisineSet.add(c));
  });
  res.json({ cuisines: Array.from(cuisineSet).sort() });
});

router.get('/:id', (req, res) => {
  const restaurant = restaurants.find(r => r.id === parseInt(req.params.id));
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  res.json({ restaurant });
});

module.exports = router;
