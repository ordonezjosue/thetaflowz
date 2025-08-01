#!/bin/bash

# ThetaFlowz Options Platform Deployment Script
echo "🚀 Starting ThetaFlowz Options Platform Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Error: Build failed. Please check for errors."
    exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy

echo "🎉 Deployment completed!"
echo "📱 Your site should be available at: https://yourusername.github.io/thetaflowz"
echo "🔗 To configure custom domain, follow the instructions in DEPLOYMENT.md" 