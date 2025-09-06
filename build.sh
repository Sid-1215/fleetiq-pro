
#!/bin/bash
# build.sh - Render.com Build Script for FleetIQ Pro

set -e

echo "🚀 Starting FleetIQ Pro build process..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

# Build frontend for production
echo "🏗️ Building frontend for production..."
npm run build

# Move back to root
cd ..

# Create production package.json if needed
echo "📝 Preparing production configuration..."

# Verify build
echo "✅ Build verification..."
if [ -d "frontend/build" ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi

if [ -f "server.js" ]; then
    echo "✅ Backend server found"
else
    echo "❌ Backend server not found"
    exit 1
fi

echo "🎉 Build completed successfully!"
echo "🌐 Ready for deployment on Render!"