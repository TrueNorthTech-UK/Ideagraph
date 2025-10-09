#!/bin/bash

# Test Export API Route
# This script tests the /api/export/[diagramId] endpoint

echo "🧪 Testing Export API Route"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
API_URL="http://localhost:3000"
DIAGRAM_ID="test-diagram-id"

echo -e "${BLUE}Test 1: GET /api/export/[diagramId] - Fetch export info${NC}"
echo "---------------------------------------"
curl -s "${API_URL}/api/export/${DIAGRAM_ID}" \
  -H "Content-Type: application/json" | jq '.' || echo -e "${RED}❌ Request failed${NC}"
echo ""

echo -e "${BLUE}Test 2: POST /api/export/[diagramId] - Export as Markdown${NC}"
echo "---------------------------------------"
curl -s -X POST "${API_URL}/api/export/${DIAGRAM_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "markdown",
    "options": {
      "includeTOC": true,
      "includeMetadata": true
    }
  }' | head -n 20
echo ""

echo -e "${BLUE}Test 3: POST /api/export/[diagramId] - Export as JSON${NC}"
echo "---------------------------------------"
curl -s -X POST "${API_URL}/api/export/${DIAGRAM_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "json",
    "options": {
      "prettyPrint": true,
      "includeComputedProperties": true
    }
  }' | jq '.' | head -n 30
echo ""

echo -e "${BLUE}Test 4: POST /api/export/[diagramId] - Export as Cursor Tasks${NC}"
echo "---------------------------------------"
curl -s -X POST "${API_URL}/api/export/${DIAGRAM_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "cursor",
    "options": {
      "includeHints": true,
      "groupByType": true
    }
  }' | jq '.' | head -n 30
echo ""

echo -e "${BLUE}Test 5: POST /api/export/[diagramId] - Invalid format${NC}"
echo "---------------------------------------"
curl -s -X POST "${API_URL}/api/export/${DIAGRAM_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "invalid-format"
  }' | jq '.'
echo ""

echo -e "${BLUE}Test 6: POST /api/export/[diagramId] - PDF (Not Implemented)${NC}"
echo "---------------------------------------"
curl -s -X POST "${API_URL}/api/export/${DIAGRAM_ID}" \
  -H "Content-Type: application/json" \
  -d '{
    "format": "pdf"
  }' | jq '.'
echo ""

echo -e "${BLUE}Test 7: POST /api/export/[diagramId] - Query parameter format${NC}"
echo "---------------------------------------"
curl -s -X POST "${API_URL}/api/export/${DIAGRAM_ID}?format=markdown&download=true" \
  -H "Content-Type: application/json" \
  -d '{}' | head -n 20
echo ""

echo ""
echo "======================================"
echo "✅ Export API Route tests complete!"
echo ""
echo "Note: These are smoke tests. Actual testing requires:"
echo "1. A running dev server (pnpm dev)"
echo "2. Authentication (valid session)"
echo "3. Valid diagram ID"
echo "4. Proper database setup"
echo ""
echo "To test manually:"
echo "1. Start dev server: pnpm dev"
echo "2. Log in and create a diagram"
echo "3. Use the diagram ID to test export"
echo "4. Check response headers and content"

