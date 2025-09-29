# IdeaGraph — Project Overview

## Executive Summary
IdeaGraph is a visual AI architecture tool that converts ideas, conversations, and existing PRDs into modern, implementation-ready system diagrams and technical documentation. It targets solo developers, small teams, and agencies by streamlining system planning, communication, and delivery with intelligent analysis, beautiful visuals, and exportable implementation plans.

## Core Technical Architecture
- Frontend: Next.js 15 (App Router), React, Tailwind CSS
- Diagramming: React Flow (`@xyflow/react` v12+)
- State Management: `zustand`
- Authentication: Better Auth
- Database: Cloudflare D1 (SQLite) via `drizzle-orm`
- Storage: Cloudflare R2
- Hosting: Cloudflare Pages + Workers
- Real-time: Cloudflare Durable Objects
- AI: Anthropic Claude via `@anthropic-ai/sdk`

## Technology Stack Breakdown
- Web Framework: Next.js 15, TypeScript 5
- UI: Tailwind CSS, shadcn/ui components
- Diagrams: React Flow custom nodes/edges, grouping, toolbars, auto-layout
- Data Layer: Drizzle ORM models, migrations for D1
- Auth: Better Auth session + middleware
- AI Services: Multi-agent analysis system (PRD analysis, recommendations)
- Realtime: Durable Objects for collaboration (presence, cursor sync, updates)
- Export: Markdown, JSON, Cursor tasks, PDF/PNG

## Development Environment Requirements
- Node.js 20+
- pnpm 9+
- Wrangler CLI 3.57+
- Drizzle Kit 0.24+
- Cloudflare account with D1, R2, Durable Objects enabled
- Environment variables configured for Anthropic and Better Auth

## Repository Structure (High-Level)
- `src/app/` App Router routes, API routes
- `src/modules/` Feature modules (auth, dashboard, todos)
- `src/components/` UI + diagram components
- `src/lib/` Core libs (ai, diagram, export, theme, utils)
- `src/db/` Drizzle schema and DB utilities
- `src/services/` Service-layer integrations (summarizer, etc.)
- `docs/` PRD, plans, and generated documentation

## Core Features
- Import PRDs and generate entities, relationships, and flows
- Conversational AI that incrementally builds/edits diagrams
- Modern React Flow canvas with custom nodes/edges and grouping
- Real-time collaboration via Durable Objects
- Multi-format export (Markdown/JSON/Cursor/PDF/PNG)

## Objectives and Outcomes
- Reduce time from idea to actionable architecture under 5 minutes
- Provide accurate PRD imports (≥85% extraction accuracy)
- Enable developer-ready exports and task breakdowns for assistants like Cursor

## Links
- Product Requirements: `docs/complete_prd.md`
- Implementation Tasks: `docs/IMPLEMENTATION_TASKS.md`
- Deployment Guide: `docs/deploy-complete.md`
