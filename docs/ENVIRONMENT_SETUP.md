# Environment Setup Guide

This guide explains how to set up the environment variables needed for Ideagraph to work with Cloudflare services.

## Required Environment Variables

### 1. Cloudflare Configuration

#### CLOUDFLARE_ACCOUNT_ID
- **Purpose**: Your Cloudflare account identifier
- **How to get**: 
  1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
  2. Copy your Account ID from the right sidebar

#### CLOUDFLARE_API_TOKEN
- **Purpose**: API token for deploying and managing Cloudflare resources
- **How to get**:
  1. Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
  2. Click "Create Token"
  3. Use "Custom token" template
  4. Permissions needed:
     - `Account:Cloudflare Workers:Edit`
     - `Zone:Zone:Read` (if using custom domain)
     - `Zone:Zone Settings:Edit` (if using custom domain)
  5. Account Resources: Include `All accounts`

#### CLOUDFLARE_D1_TOKEN
- **Purpose**: Token for D1 database operations
- **How to get**: Same as CLOUDFLARE_API_TOKEN, but with D1-specific permissions:
  - `Account:D1:Edit`
  - `Account:Cloudflare Workers:Edit`

### 2. Authentication (Better Auth)

#### BETTER_AUTH_SECRET
- **Purpose**: Secret key for session encryption and JWT signing
- **How to generate**: 
  ```bash
  openssl rand -base64 32
  ```
  Or use any secure random string generator (32+ characters)

#### BETTER_AUTH_URL
- **Purpose**: Base URL for your deployed application
- **Format**: `https://your-app.workers.dev`

### 3. Google OAuth (Optional but Recommended)

#### GOOGLE_CLIENT_ID
#### GOOGLE_CLIENT_SECRET
#### GOOGLE_REDIRECT_URI
- **Purpose**: Enable Google sign-in functionality
- **How to get**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/)
  2. Create a new project or select existing
  3. Enable Google+ API
  4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
  5. Application type: "Web application"
  6. Authorized redirect URIs: `https://your-app.workers.dev/auth/callback`

### 4. R2 Storage Configuration

#### CLOUDFLARE_R2_URL
- **Purpose**: Public URL for R2 bucket
- **Format**: `https://your-account-id.r2.cloudflarestorage.com/ideagraph-media`

#### CLOUDFLARE_R2_BUCKET
- **Purpose**: R2 bucket name for file storage
- **Format**: `ideagraph-media`

### 5. AI Services (Optional)

#### ANTHROPIC_API_KEY
- **Purpose**: Enable AI-powered summarization features
- **How to get**: Sign up at [Anthropic](https://console.anthropic.com/) and create an API key

## Setup Instructions

### Local Development

1. Copy the example file:
   ```bash
   cp .env.example .dev.vars
   ```

2. Edit `.dev.vars` with your actual values:
   ```bash
   nano .dev.vars
   ```

3. Authenticate with Cloudflare:
   ```bash
   npx wrangler login
   ```

4. Run the development server:
   ```bash
   pnpm run dev:cf
   ```

### Production Deployment

#### GitHub Secrets Setup

Add these secrets to your GitHub repository:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following repository secrets:

```
BETTER_AUTH_SECRET
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
CLOUDFLARE_R2_URL
```

#### Cloudflare Secrets Setup

Set secrets in Cloudflare Workers:

```bash
# Set authentication secret
npx wrangler secret put BETTER_AUTH_SECRET

# Set Google OAuth credentials
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET

# Set R2 URL
npx wrangler secret put CLOUDFLARE_R2_URL
```

### Verification

#### Check Cloudflare Authentication
```bash
npx wrangler whoami
```

#### Verify D1 Database Connection
```bash
npx wrangler d1 execute next-cf-app --local --command="SELECT name FROM sqlite_master WHERE type='table';"
```

#### Check R2 Bucket Access
```bash
npx wrangler r2 bucket list
```

## Troubleshooting

### Common Issues

1. **"You are not authenticated"**
   - Run `npx wrangler login`
   - Verify your API token has correct permissions

2. **Database connection errors**
   - Check CLOUDFLARE_D1_TOKEN has D1 permissions
   - Verify database ID in wrangler.jsonc

3. **R2 upload failures**
   - Check CLOUDFLARE_R2_URL format
   - Verify bucket exists and is accessible

4. **Google OAuth errors**
   - Verify redirect URI matches exactly
   - Check client ID and secret are correct

### Environment Variable Priority

1. `.dev.vars` (local development)
2. Wrangler secrets (production)
3. GitHub secrets (CI/CD)

## Security Notes

- Never commit `.dev.vars` or any file containing real secrets
- Use different secrets for development and production
- Regularly rotate API keys and secrets
- Monitor API usage for unexpected activity

## Next Steps

After setting up environment variables:

1. Run database migrations: `pnpm run db:migrate:local`
2. Test local development: `pnpm run dev:cf`
3. Deploy to preview: `pnpm run deploy:preview`
4. Deploy to production: `pnpm run deploy`
