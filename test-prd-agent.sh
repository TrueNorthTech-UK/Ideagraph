#!/bin/bash

# Test script for PRDAnalysisAgent
# Tests the /api/ai/analyze-prd endpoint with sample PRD content

echo "Testing PRDAnalysisAgent..."
echo "=============================="
echo ""

# Sample PRD content
PRD_CONTENT='# E-commerce Platform PRD

## Overview
Build a modern e-commerce platform with React frontend, Node.js backend, and PostgreSQL database.

## Components

### Frontend
- Product listing page with search and filters
- Shopping cart component
- Checkout flow with payment integration
- User profile and order history

### Backend
- REST API for product management
- User authentication service
- Order processing service
- Payment gateway integration

### Database
- Users table with authentication data
- Products catalog with inventory
- Orders table with line items
- Payment transactions log

## User Flows
1. Browse products → Add to cart → Checkout → Payment → Order confirmation
2. User registration → Email verification → Profile setup
3. Search products → Filter results → View details → Purchase'

# Make the API call
echo "Making API call to analyze PRD..."
echo ""

curl -X POST http://localhost:3000/api/ai/analyze-prd \
  -H "Content-Type: application/json" \
  -d "{
    \"content\": $(echo "$PRD_CONTENT" | jq -Rs .),
    \"fileName\": \"test-prd.md\"
  }" | jq '.'

echo ""
echo "=============================="
echo "Test complete!"

