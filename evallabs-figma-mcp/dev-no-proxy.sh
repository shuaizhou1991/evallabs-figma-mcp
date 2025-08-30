#!/bin/bash

# Development script that bypasses proxy interference
echo "🚀 Starting development server without proxy interference..."

# Unset all proxy environment variables
unset http_proxy https_proxy all_proxy HTTP_PROXY HTTPS_PROXY ALL_PROXY

# Check if port 3000 is available, if not use 3001
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is in use, using port 3001..."
    PORT=3001 npm run dev
else
    echo "✅ Port 3000 is available"
    npm run dev
fi
