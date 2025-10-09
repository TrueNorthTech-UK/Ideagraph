# Scripts Directory

This directory contains utility scripts for database management and development tasks.

## 📁 Available Scripts

### `seed-demo.sql`
Seeds the database with demo data for testing and development.

**Features:**
- Creates a demo user (`demo@ideagraph.dev`)
- Creates a demo project ("Demo Project: System Architecture")
- Creates a demo diagram with React Flow nodes and edges
- **Idempotent**: Safe to run multiple times without creating duplicates

**Usage:**
```bash
# Seed local database
pnpm run db:seed:local

# Seed production database
pnpm run db:seed:prod
```

**Demo Data Details:**

**User:**
- ID: `demo-user-001`
- Email: `demo@ideagraph.dev`
- Name: Demo User

**Project:**
- ID: `project-demo-001`
- Name: Demo Project: System Architecture
- Owner: demo-user-001

**Diagram:**
- ID: `diagram-demo-001`
- Name: Demo Diagram: Microservices Architecture
- Contains 4 nodes:
  - Frontend (React)
  - API Gateway
  - Auth Service
  - Database (PostgreSQL)
- Contains 3 edges connecting the nodes

### `seed-demo-data.ts`
TypeScript version of the seeding script (for programmatic use).

**Note:** This script requires compilation and D1 context. Use the SQL version for direct execution.

### `verify-env.js`
Validates environment configuration and Cloudflare setup.

**Usage:**
```bash
pnpm run verify-env
```

## 🔧 Database Management Commands

### Migrations
```bash
# Generate a new migration
pnpm run db:generate

# Generate a named migration
pnpm run db:generate:named "migration_name"

# Apply migrations to local database
pnpm run db:migrate:local

# Apply migrations to production
pnpm run db:migrate:prod
```

### Inspection
```bash
# List all tables in local database
pnpm run db:inspect:local

# List all tables in production database
pnpm run db:inspect:prod
```

### Seeding
```bash
# Seed local database with demo data
pnpm run db:seed:local

# Seed production database with demo data (use with caution!)
pnpm run db:seed:prod
```

### Studio
```bash
# Open Drizzle Studio for local database
pnpm run db:studio:local
```

### Reset
```bash
# Reset local database (drops tables and reapplies migrations)
pnpm run db:reset:local
```

## 📝 Notes

- All seed scripts use `INSERT OR IGNORE` to ensure idempotency
- Demo data uses fixed IDs for consistency across environments
- Production seeding should be done with caution and review
- The demo user has no password - for testing with auth, create a real user through the signup flow

