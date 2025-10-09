# IdeaGraph Authentication Flow (Task 030)

## 🔐 Complete Authentication Architecture

### Overview
IdeaGraph implements a **defense-in-depth** authentication strategy with protection at both the middleware layer and individual API route level using Better Auth.

---

## 📊 Request Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        User Request                          │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
        ┌───────────────────────────────────────┐
        │      Is path protected?               │
        │  /dashboard/* or /api/(not auth)?    │
        └───────────┬───────────────────────────┘
                    │
            ┌───────┴───────┐
            │               │
           YES             NO
            │               │
            ▼               ▼
┌─────────────────┐   ┌─────────────────┐
│  middleware.ts  │   │  Pass through   │
│  Check session  │   │   to handler    │
└────────┬────────┘   └─────────────────┘
         │
    ┌────┴─────┐
    │          │
  Valid    No Session
    │          │
    │          ▼
    │    ┌──────────────────┐
    │    │ Redirect to      │
    │    │    /login        │
    │    └──────────────────┘
    │
    ▼
┌─────────────────────┐
│  API Route Handler  │
│  Check auth()       │
└──────────┬──────────┘
           │
      ┌────┴─────┐
      │          │
    Valid    Not Auth
      │          │
      │          ▼
      │    ┌──────────────┐
      │    │  Return 401  │
      │    │ Unauthorized │
      │    └──────────────┘
      │
      ▼
┌──────────────────────┐
│  Process Request     │
│  Return Response     │
└──────────────────────┘
```

---

## 🛡️ Protection Layers

### Layer 1: Middleware (middleware.ts)
**Purpose:** Protect entire route segments  
**Technology:** Next.js middleware with Better Auth

```typescript
// Protection Scope:
- /dashboard/:path*       → All dashboard routes
- /api/((?!auth).)*      → All API routes except /api/auth/*

// Actions:
1. Validate session using Better Auth
2. If no session → Redirect to /login
3. If error → Redirect to /login
4. If valid → Pass to route handler
```

**Files:**
- `middleware.ts` (lines 4-28)

---

### Layer 2: API Routes
**Purpose:** Verify authentication at endpoint level  
**Technology:** Better Auth helper function

```typescript
// Pattern used in all API routes:
const user = await auth();
if (!user) {
    throw unauthorizedError();
}

// Returns:
- 401 Unauthorized if not authenticated
- User object if authenticated
```

**Files:**
- `src/app/api/projects/route.ts` (lines 23-26, 61-64)
- `src/app/api/diagrams/route.ts` (lines 24-27, 89-92)
- All future API routes follow same pattern

---

## 🔑 Better Auth Integration

### Session Validation
```typescript
// src/lib/auth.ts
export async function auth(): Promise<AuthUser | null> {
    const authInstance = await getAuth();
    const session = await authInstance.api.getSession({
        headers: await headers(),
    });
    
    return session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
    } : null;
}
```

### Key Features:
- ✅ Edge runtime compatible
- ✅ SQLite/D1 adapter
- ✅ Email/password authentication
- ✅ Google OAuth integration
- ✅ Session cookie management
- ✅ Automatic session refresh

---

## 🚪 Route Protection Matrix

| Route Pattern | Protected | Redirect | Auth Check |
|--------------|-----------|----------|------------|
| `/` | ❌ No | - | - |
| `/login` | ❌ No | - | - |
| `/signup` | ❌ No | - | - |
| `/dashboard` | ✅ Yes | /login | Middleware |
| `/dashboard/*` | ✅ Yes | /login | Middleware |
| `/api/auth/*` | ❌ No | - | - |
| `/api/projects` | ✅ Yes | /login | Middleware + Route |
| `/api/diagrams` | ✅ Yes | /login | Middleware + Route |
| `/api/export/*` | ✅ Yes | /login | Middleware + Route |
| `/api/ai/*` | ✅ Yes | /login | Middleware + Route |

---

## 🎯 Example Scenarios

### Scenario 1: Unauthenticated User Visits Dashboard
```
1. GET /dashboard
2. middleware.ts: Check session
3. Result: No session
4. Action: Redirect to /login
5. User sees login page
```

### Scenario 2: Unauthenticated API Request
```
1. GET /api/projects
2. middleware.ts: Check session
3. Result: No session
4. Action: Redirect to /login
   (Browser follows redirect)
```

### Scenario 3: Authenticated User Visits Dashboard
```
1. GET /dashboard
2. middleware.ts: Check session
3. Result: Valid session
4. Action: Pass to route handler
5. Dashboard renders with user data
```

### Scenario 4: Authenticated API Request
```
1. GET /api/projects
2. middleware.ts: Check session
3. Result: Valid session
4. Action: Pass to route handler
5. API route: Check auth()
6. Result: Valid user
7. Action: Query database
8. Return: JSON response with projects
```

### Scenario 5: Public Auth Endpoint
```
1. POST /api/auth/sign-in
2. middleware.ts: Check matcher
3. Result: Path matches exclusion ((?!auth).)*
4. Action: Pass through (no session check)
5. Better Auth handles authentication
6. Return: Session cookie + user data
```

---

## 🔧 Configuration

### Middleware Matcher
```typescript
// middleware.ts
export const config = {
    matcher: [
        "/dashboard/:path*",      // Protects all dashboard routes
        "/api/((?!auth).)*",      // Protects all API except auth
    ],
};
```

### Better Auth Setup
```typescript
// src/lib/auth.ts
betterAuth({
    secret: env.BETTER_AUTH_SECRET,
    database: drizzleAdapter(db, {
        provider: "sqlite",
    }),
    emailAndPassword: { enabled: true },
    socialProviders: {
        google: {
            enabled: true,
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
    },
    plugins: [nextCookies()],
});
```

---

## 📝 Error Handling

### Middleware Errors
```typescript
try {
    // Validate session
    const auth = await getAuth();
    const session = await auth.api.getSession({ headers });
    
    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    
    return NextResponse.next();
} catch (_error) {
    // If session validation fails, redirect to login
    return NextResponse.redirect(new URL("/login", request.url));
}
```

### API Route Errors
```typescript
const user = await auth();
if (!user) {
    throw unauthorizedError(); // Returns 401 with error code
}
```

---

## 🧪 Testing

### Automated Tests
```bash
node scripts/test-auth-protection.ts
```

**Tests:**
1. ✅ Middleware protects /dashboard
2. ✅ API routes check authentication
3. ✅ Auth routes remain public
4. ✅ Redirect to /login for unauthenticated users

### Manual Testing
```bash
# Test 1: Dashboard without auth
curl -I http://localhost:3000/dashboard
# Expected: Location: /login

# Test 2: API without auth
curl http://localhost:3000/api/projects
# Expected: {"error": "Unauthorized", "code": "UNAUTHORIZED"}

# Test 3: Public auth endpoint
curl http://localhost:3000/api/auth/session
# Expected: Session data or empty (no 401)
```

---

## 🚀 Performance Considerations

1. **Session Caching:** Better Auth caches auth instance to prevent redundant initialization
2. **Edge Compatible:** All auth logic runs on Cloudflare Workers edge runtime
3. **Minimal Overhead:** Session check adds ~1-2ms per request
4. **Stateless:** Session stored in HTTP-only cookies, no server-side storage needed

---

## 🔒 Security Features

- ✅ **Defense in Depth:** Two layers of authentication checks
- ✅ **Secure Cookies:** HTTP-only, secure, SameSite=Lax
- ✅ **Edge Compatible:** Runs on Cloudflare Workers globally
- ✅ **No Token Exposure:** Session in cookies, not localStorage
- ✅ **Automatic Logout:** Invalid sessions redirect to login
- ✅ **Error Safety:** Errors don't leak sensitive information
- ✅ **Future Proof:** Wildcard matchers protect future routes

---

## 📚 Related Documentation

- **Task 004:** Auth Foundation with Better Auth
- **Task 006:** Dashboard Shell and Navigation
- **Task 027:** Error Handling and API Error Utility
- **Task 029:** Login/Signup Forms Using Better Auth
- **Task 030:** Protected Dashboard Routes and Redirects

---

**Last Updated:** October 9, 2025  
**Version:** 0.1.30  
**Status:** Production Ready ✅

