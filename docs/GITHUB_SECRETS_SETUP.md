# GitHub Secrets Setup Guide

This guide explains how to set up the required secrets in your GitHub repository for automated deployment.

## Required GitHub Secrets

Your GitHub repository needs these secrets configured for the deployment workflow to work:

### 1. Go to Repository Settings
1. Navigate to your repository: `https://github.com/TrueNorthTech-UK/Ideagraph`
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 2. Add Each Secret

Add these secrets one by one (click "New repository secret" for each):

#### Authentication
- **Name**: `BETTER_AUTH_SECRET`
- **Value**: `[Your Better Auth Secret from .dev.vars]`

#### Google OAuth
- **Name**: `GOOGLE_CLIENT_ID`
- **Value**: `[Your Google Client ID from .dev.vars]`

- **Name**: `GOOGLE_CLIENT_SECRET`
- **Value**: `[Your Google Client Secret from .dev.vars]`

#### Cloudflare Configuration
- **Name**: `CLOUDFLARE_API_TOKEN`
- **Value**: `[Your Cloudflare API Token from .dev.vars]`

- **Name**: `CLOUDFLARE_ACCOUNT_ID`
- **Value**: `[Your Cloudflare Account ID from .dev.vars]`

#### R2 Storage
- **Name**: `CLOUDFLARE_R2_URL`
- **Value**: `[Your R2 URL from .dev.vars]`

## Verification

After adding all secrets:

1. Go to **Actions** tab in your repository
2. Find the failed deployment and click **Re-run all jobs**
3. The deployment should now succeed

## Troubleshooting

### "Value for secret X not found in environment"
- Make sure the secret name matches exactly (case-sensitive)
- Ensure the secret was added to the repository (not organization level)

### "Failed to upload secrets"
- Verify the CLOUDFLARE_API_TOKEN has the correct permissions
- Check that the CLOUDFLARE_ACCOUNT_ID is correct

### "The entry-point file at .open-next/worker.js was not found"
- This happens when the build fails due to missing secrets
- Fix the secrets first, then the build will succeed

## Security Notes

- These secrets are only accessible to GitHub Actions
- They are encrypted and cannot be viewed after creation
- They are only used during deployment
- If you need to update a secret, delete the old one and create a new one

## Next Steps

Once secrets are configured:
1. Push any change to trigger a new deployment
2. Monitor the Actions tab for deployment status
3. Your app will be available at: `https://ideagraph.floral-waterfall-e0f8.workers.dev`
