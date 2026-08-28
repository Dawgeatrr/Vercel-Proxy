# Vercel Proxy

A general-purpose web proxy that runs on Vercel serverless functions. Bypass CORS restrictions and proxy requests to any HTTP/HTTPS endpoint.

## Features

- ✅ Bypass CORS restrictions
- ✅ Support for GET, POST, PUT, DELETE methods
- ✅ Forward headers and body
- ✅ Handle JSON, text, and binary responses
- ✅ Automatic CORS headers
- ✅ 10MB payload limit
- ✅ 10-second timeout

## Quick Deploy

### 1. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dawgeatrr/vercel-proxy)

### 2. Manual Deployment

```bash
# Clone the repository
git clone https://github.com/yourusername/vercel-proxy
cd vercel-proxy

# Install dependencies
npm install

# Deploy to Vercel
vercel --prod
