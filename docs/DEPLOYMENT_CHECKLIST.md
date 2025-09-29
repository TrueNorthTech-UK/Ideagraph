# Deployment Checklist

## Environment Configuration
- [ ] `ANTHROPIC_API_KEY` set
- [ ] `BETTER_AUTH_SECRET` set
- [ ] D1 binding configured
- [ ] R2 bucket and binding configured
- [ ] Durable Objects class bound

## Database Migrations
- [ ] Drizzle migrations generated
- [ ] Applied to production D1

## Security
- [ ] Auth middleware enforced on dashboard/API
- [ ] Rate limiting on AI endpoints
- [ ] Secrets not exposed to client

## Performance
- [ ] Canvas interaction at 60fps with 100+ nodes
- [ ] Export times under 5s
- [ ] AI analysis under 15s

## Monitoring
- [ ] Error tracking enabled
- [ ] Performance monitoring dashboards

## Backups
- [ ] D1 export strategy
- [ ] R2 lifecycle rules

## Documentation
- [ ] User and developer docs updated
- [ ] API docs current

## Final Verification
- [ ] E2E tests green
- [ ] Rollback plan prepared
