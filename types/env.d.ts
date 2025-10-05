// Ambient type augmentation for Cloudflare environment variables (secrets)
// These are provided at runtime via Wrangler secrets but need TS awareness.
interface CloudflareEnv {
    BETTER_AUTH_SECRET: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
}


