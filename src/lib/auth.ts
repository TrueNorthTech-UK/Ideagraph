/** biome-ignore-all lint/style/noNonNullAssertion: <we will make sure it's not null> */
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import { getDb } from "@/db";
import type { AuthUser } from "@/modules/auth/models/user.model";

let authInstance: ReturnType<typeof betterAuth> | null = null;

const createAuth = async () => {
    if (authInstance) {
        return authInstance;
    }

    const { env } = await getCloudflareContext({ async: true });
    const db = await getDb();
    authInstance = betterAuth({
        secret: env.BETTER_AUTH_SECRET,
        database: drizzleAdapter(db, {
            provider: "sqlite",
        }),
        emailAndPassword: {
            enabled: true,
        },
        socialProviders: {
            google: {
                enabled: true,
                clientId: env.GOOGLE_CLIENT_ID!,
                clientSecret: env.GOOGLE_CLIENT_SECRET!,
            },
        },
        plugins: [nextCookies()],
    });

    return authInstance;
};

export const getAuth = async () => {
    return await createAuth();
};

/**
 * Get the current authenticated user session
 * Simple helper for server-side session retrieval
 * Returns null if no user is authenticated
 *
 * Usage:
 * ```ts
 * const user = await auth();
 * if (!user) {
 *   return redirect('/login');
 * }
 * ```
 */
export async function auth(): Promise<AuthUser | null> {
    try {
        const authInstance = await getAuth();
        const session = await authInstance.api.getSession({
            headers: await headers(),
        });

        if (!session?.user) {
            return null;
        }

        return {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
        };
    } catch (error) {
        console.error("Error getting auth session:", error);
        return null;
    }
}
