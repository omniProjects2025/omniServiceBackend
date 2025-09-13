# cPanel Deployment Guide

## Environment Variables Setup

Create a `.env` file in your project root with these variables:

```bash
# Database Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# CORS Configuration (comma-separated list of allowed origins)
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,http://localhost:4200

# Server Configuration
NODE_ENV=production
PORT=3000

# Email Configuration (if using SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
MAIL_TO=admin@yourdomain.com
```

## cPanel Deployment Steps

1. **Upload your code** to cPanel File Manager
2. **Install dependencies**: Run `npm install` in terminal
3. **Create .env file** with your actual domain and credentials
4. **Update CORS origins** in server.js (replace `yourdomain.com` with your actual domain)
5. **Start the server**: `npm start` or `node server.js`

## CORS Configuration

Your server is already configured to allow:
- `http://localhost:4200` (your Angular app)
- `https://omni-hospitals.in` (production domains)
- Legacy Vercel domains

## Testing from localhost:4200

Your Angular app at `localhost:4200` should be able to access:
- `https://yourdomain.com/api/getdoctors`
- `https://yourdomain.com/api/gethealthpackages`
- `https://yourdomain.com/api/getfixedsurgicalpackages`

## Performance Optimizations Applied

✅ Database connection pooling
✅ Automatic indexing
✅ Response caching (5 minutes)
✅ Server startup warmup
✅ Query optimization with .lean()

Expected response times:
- First request: 1-2 seconds
- Cached requests: 50-200ms
