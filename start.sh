#!/bin/bash
echo "🍕 FoodDash - Food Delivery Platform"
echo "===================================="
echo ""

cd "$(dirname "$0")"

echo "Building frontend..."
cd frontend && npm run build 2>&1 | tail -3
echo ""

echo "Starting production server..."
cd ../backend && node server.js
