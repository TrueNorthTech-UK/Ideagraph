# Anthropic Client Usage Guide

**Created:** October 9, 2025
**Task:** 017 - Anthropic Client Setup and Env Wiring
**Version:** 0.1.29

---

## Overview

The Anthropic AI client is configured and ready for use across the IdeaGraph application. This guide covers setup, configuration, and usage patterns.

## Configuration

### Environment Variables

The client requires the `ANTHROPIC_API_KEY` environment variable to be set.

#### Local Development

Create or update `.env.local`:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

#### Cloudflare Production

Use Wrangler secrets:

```bash
pnpm run cf:secret ANTHROPIC_API_KEY
# Enter your API key when prompted
```

#### Get an API Key

Visit: https://console.anthropic.com/settings/keys

---

## Usage

### Basic Usage (Singleton Client)

```typescript
import { anthropicClient, ANTHROPIC_MODELS } from '@/lib/ai/client';

// Make a simple API call
const response = await anthropicClient.messages.create({
    model: ANTHROPIC_MODELS.SONNET,
    max_tokens: 1024,
    messages: [
        {
            role: "user",
            content: "Hello, Claude!"
        }
    ]
});

// Extract response text
const contentBlock = response.content[0];
const text = contentBlock.type === 'text' ? contentBlock.text : '';
```

### Custom Client Configuration

```typescript
import { createAnthropicClient } from '@/lib/ai/client';

// Create a custom client with specific settings
const customClient = createAnthropicClient({
    maxRetries: 5,
    timeout: 120000, // 2 minutes
});
```

### Using System Prompts

```typescript
import { anthropicClient, ANTHROPIC_MODELS, SYSTEM_PROMPTS } from '@/lib/ai/client';

const response = await anthropicClient.messages.create({
    model: ANTHROPIC_MODELS.SONNET,
    max_tokens: 4096,
    system: SYSTEM_PROMPTS.PRD_ANALYZER,
    messages: [
        {
            role: "user",
            content: "Analyze this PRD..."
        }
    ]
});
```

---

## Available Models

The client provides constants for commonly used models:

```typescript
export const ANTHROPIC_MODELS = {
    // High-quality analysis and complex reasoning
    SONNET: "claude-3-5-sonnet-20241022",
    
    // Fast responses for simple tasks
    HAIKU: "claude-3-5-haiku-20241022",
    
    // Maximum capability for critical tasks
    OPUS: "claude-3-opus-20240229",
} as const;
```

### Model Selection Guidelines

- **SONNET**: Use for PRD analysis, architecture recommendations, complex reasoning
- **HAIKU**: Use for simple completions, quick responses, chat interactions
- **OPUS**: Use for critical analysis requiring maximum capability

---

## System Prompts

Pre-configured system prompts for different agent types:

- `SYSTEM_PROMPTS.PRD_ANALYZER` - For PRD analysis tasks
- `SYSTEM_PROMPTS.ARCHITECT` - For architecture design tasks
- `SYSTEM_PROMPTS.DATABASE` - For database design tasks
- `SYSTEM_PROMPTS.FRONTEND` - For frontend architecture tasks
- `SYSTEM_PROMPTS.BACKEND` - For backend architecture tasks

---

## Error Handling

The client includes automatic error handling with helpful messages:

```typescript
try {
    const response = await anthropicClient.messages.create({...});
} catch (error) {
    if (error instanceof Error && error.message.includes('ANTHROPIC_API_KEY')) {
        // API key not configured
        console.error('API key missing:', error.message);
    }
    // Handle other errors
}
```

---

## Testing the Client

### Test Endpoint

A test endpoint is available at `/api/ai/test-anthropic`:

```bash
# Must be authenticated first
curl http://localhost:3000/api/ai/test-anthropic
```

Expected response:
```json
{
    "success": true,
    "message": "Anthropic client test successful",
    "data": {
        "response": "Anthropic client is working correctly.",
        "model": "claude-3-5-haiku-20241022",
        "usage": {
            "inputTokens": 15,
            "outputTokens": 8
        },
        "latency": "542ms",
        "timestamp": "2025-10-09T..."
    }
}
```

### Test Script

Run the included test script:

```bash
./test-anthropic-client.sh
```

---

## Environment Validation

The client includes utilities for environment validation:

```typescript
import { requireEnv, getEnv, getOptionalEnv } from '@/lib/utils';

// Require an environment variable (throws if missing)
const apiKey = requireEnv('ANTHROPIC_API_KEY');

// Get with fallback
const timeout = getEnv('API_TIMEOUT', '60000');

// Get optional variable
const customModel = getOptionalEnv('CUSTOM_MODEL');
```

---

## Edge Runtime Compatibility

The client is fully compatible with Cloudflare Workers edge runtime:

- Uses standard `process.env` for environment variables
- No Node.js-specific dependencies
- Configured with appropriate timeouts and retries
- Handles edge runtime limitations gracefully

---

## Configuration Defaults

```typescript
const DEFAULT_CONFIG = {
    maxRetries: 3,
    timeout: 60000, // 60 seconds
} as const;
```

---

## Next Steps

With the Anthropic client configured, you can now:

1. **Task 018**: Implement PRDAnalysisAgent with structured output parsing
2. Use the client for AI-powered features throughout the application
3. Extend system prompts for specialized agent types

---

## Security Notes

- API keys are validated at runtime with clear error messages
- Keys should never be committed to version control
- Use Cloudflare secrets for production deployments
- Test endpoint requires authentication to prevent unauthorized usage

---

## Support

For issues or questions:
- Check the test endpoint: `/api/ai/test-anthropic`
- Review logs for error messages
- Verify API key is correctly configured
- Ensure you have sufficient API credits at Anthropic

---

**Document Version:** 1.0
**Last Updated:** October 9, 2025

