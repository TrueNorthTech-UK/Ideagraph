# Technical Challenges

## Cloudflare D1 Limitations
- Challenge: Limited concurrency, SQL features
- Mitigation: Keep transactions simple, precompute denormalized fields, use indices, batch writes

## Real-time Collaboration Complexity
- Challenge: Consistency across clients, conflict resolution
- Mitigation: Durable Object authority, CRDT-like merge rules, periodic snapshots to D1

## AI Response Parsing Reliability
- Challenge: Non-JSON outputs, schema drift
- Mitigation: Regex extraction, JSON schema validation, retries with system prompts, truncation guards

## Large Diagram Performance
- Challenge: 100+ nodes at 60fps
- Mitigation: Memoized selectors, virtualization for side panels, animated edges throttle, viewport culling

## Cross-Browser Compatibility
- Challenge: Pointer events, fonts
- Mitigation: Test on Chromium, WebKit, Gecko; fallbacks for wheel/trackpad; CSS resets

## Streaming Responses at Edge
- Challenge: Stable streaming for chat
- Mitigation: Use Web Streams API patterns supported by Workers; backpressure handling
