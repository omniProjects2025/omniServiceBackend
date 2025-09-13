#!/bin/bash

# OMNI Hospitals API Deployment Script for cPanel

echo "🚀 Starting OMNI Hospitals API deployment..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Stop existing PM2 processes
echo "🛑 Stopping existing PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Start the application with PM2
echo "🎯 Starting application with PM2..."
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Show PM2 status
echo "📊 PM2 Status:"
pm2 status

echo "✅ Deployment completed!"
echo "🌐 Your API should be running on port 3000"
echo "📝 Check logs with: pm2 logs"
echo "🔄 Restart with: pm2 restart omni-hospitals-api"
