#!/bin/bash

# Test the PRD Analysis API endpoint
# This tests the authentication and validation requirements

echo "Testing PRD Analysis API Endpoint..."
echo "======================================"
echo ""

# Test 1: Without authentication (should fail with 401)
echo "Test 1: Request without authentication"
curl -X POST http://localhost:3000/api/ai/analyze-prd \
  -H "Content-Type: application/json" \
  -d '{"content": "This is a sample PRD content with more than 100 characters to pass validation. It describes a system architecture with various components and workflows."}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""
echo "Expected: 401 Unauthorized"
echo "======================================"
echo ""

# Test 2: With invalid content (too short)
echo "Test 2: Request with invalid content (too short)"
curl -X POST http://localhost:3000/api/ai/analyze-prd \
  -H "Content-Type: application/json" \
  -d '{"content": "Short"}' \
  -w "\nHTTP Status: %{http_code}\n" \
  -s
echo ""
echo "Expected: 400 Bad Request - Validation failed"
echo "======================================"
echo ""

# Test 3: Valid request structure (will need auth in production)
echo "Test 3: Valid request structure"
echo "Note: This will return 401 unless you're authenticated"
echo "Schema validation should pass if authenticated"
echo ""
echo "Sample valid request:"
cat << 'JSON'
{
  "content": "This is a comprehensive PRD describing a microservices architecture. The system consists of multiple components including a React frontend, Node.js backend services, PostgreSQL database, Redis cache, and message queues for async processing. The frontend communicates with the backend via REST APIs...",
  "projectId": "550e8400-e29b-41d4-a716-446655440000",
  "fileName": "system-architecture.md"
}
JSON
echo ""
echo "======================================"

