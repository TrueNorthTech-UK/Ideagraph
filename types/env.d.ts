// Ambient type augmentation for Cloudflare environment variables (secrets)
// These are provided at runtime via Wrangler secrets but need TS awareness.
interface CloudflareEnv {
    // Authentication
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL?: string;

    // Google OAuth
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_REDIRECT_URI?: string;

    // Cloudflare Configuration
    CLOUDFLARE_ACCOUNT_ID?: string;
    CLOUDFLARE_API_TOKEN?: string;
    CLOUDFLARE_D1_TOKEN?: string;

    // R2 Storage
    CLOUDFLARE_R2_URL?: string;
    CLOUDFLARE_R2_BUCKET?: string;

    // AI Services
    ANTHROPIC_API_KEY?: string;
}
