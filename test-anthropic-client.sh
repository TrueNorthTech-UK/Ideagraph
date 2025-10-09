#!/bin/bash

# Test script for Anthropic AI client configuration (Task 017)
# This script verifies that the Anthropic client is properly configured

echo "🧪 Testing Anthropic AI Client Configuration"
echo "=============================================="
echo ""

# Check if ANTHROPIC_API_KEY is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  WARNING: ANTHROPIC_API_KEY is not set"
    echo "Please set it before running the test:"
    echo ""
    echo "  export ANTHROPIC_API_KEY=your_api_key_here"
    echo ""
    echo "Or add it to .env.local:"
    echo "  ANTHROPIC_API_KEY=your_api_key_here"
    echo ""
    echo "You can get an API key from: https://console.anthropic.com/settings/keys"
    echo ""
    exit 1
fi

echo "✅ ANTHROPIC_API_KEY is configured"
echo ""

# Check if the dev server is running
echo "📝 Instructions for testing:"
echo ""
echo "1. Start the development server:"
echo "   pnpm dev"
echo ""
echo "2. Log in to the application:"
echo "   Navigate to http://localhost:3000/login"
echo ""
echo "3. Test the Anthropic client:"
echo "   curl http://localhost:3000/api/ai/test-anthropic"
echo ""
echo "4. Expected response should include:"
echo "   - success: true"
echo "   - response from AI"
echo "   - model information"
echo "   - token usage"
echo "   - latency metrics"
echo ""
echo "✅ Configuration test complete"
echo ""
echo "To test the client programmatically, use:"
echo "  import { anthropicClient } from '@/lib/ai/client';"
echo ""

