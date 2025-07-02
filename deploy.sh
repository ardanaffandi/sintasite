#!/bin/bash

# Deployment script for production
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type checking
echo "🔍 Running type checks..."
npm run type-check || {
    echo "❌ Type check failed. Please fix TypeScript errors before deploying."
    exit 1
}

# Run linting
echo "🧹 Running linter..."
npm run lint || {
    echo "⚠️ Linting issues found. Consider fixing them before deploying."
}

# Build the project
echo "🏗️ Building project..."
npm run build || {
    echo "❌ Build failed. Please fix build errors before deploying."
    exit 1
}

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod || {
    echo "❌ Deployment failed."
    exit 1
}

echo "✅ Deployment completed successfully!"
echo "🎉 Your site is now live!"
echo ""
echo "📱 Public Site: https://your-site.vercel.app"
echo "🔧 Admin Panel: https://your-site.vercel.app/admin"
echo "👤 Login: sinta / Ketemudibandung1"
echo ""
echo "🔄 Any changes you make in the CMS will be reflected immediately on the live site!"
