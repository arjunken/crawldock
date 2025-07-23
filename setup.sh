#!/bin/bash

# CrowlDock Setup Script
echo "🔍 Setting up CrowlDock..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp config.example.json .env
    echo "✅ .env file created!"
    echo "⚠️  Please edit .env with your actual API keys"
else
    echo "✅ .env file already exists"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
else
    echo "✅ Dependencies already installed"
fi

# Build the project
echo "🔨 Building CrowlDock..."
npm run build
echo "✅ Build complete!"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env with your Google API keys"
echo "2. Configure your MCP client (LM Studio, etc.)"
echo "3. Test with: npm start"
echo ""
echo "📖 Read SECURITY.md for API key protection best practices" 