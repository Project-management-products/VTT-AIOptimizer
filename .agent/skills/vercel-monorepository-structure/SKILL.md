---
name: vercel-monorepository-structure
description: Guidance for setting up and maintaining a language-agnostic hybrid monorepo (Frontend + Backend) optimized for Vercel deployment and Turborepo orchestration.
---

# Vercel Monorepository Structure

This skill provides the architectural blueprint and configuration rules to ensure a frontend and a backend coexist seamlessly in a single Vercel project using a monorepo pattern.

## When to use this skill
- Use this for projects where the Frontend and Backend are distinct applications with their own manifests (`package.json`, `requirements.txt`, etc.).
- Use this when the project requires shared code (e.g., shared types, UI components) in a `packages/` directory.
- Use this when initializing a new hybrid project or troubleshooting 404/routing conflicts in Vercel.
- This is helpful for configuring local development environments where the frontend proxies requests to a separate local backend server.

## How to use it

### Goal
To establish a "Weightless" architecture where `apps/` contains deployable units and `packages/` contains reusable code, sharing the same domain and environment settings.

### Project Hierarchy
The agent must ensure the following directory structure:



```text
<root>/
├── apps/
│   ├── <frontend_app>/      # Frontend (Next.js, Vite, Vue, etc.)
│   │   └── <manifest>       # e.g., package.json
│   └── <backend_app>/       # Backend (FastAPI, Express, NestJS, etc.)
│       └── <manifest>       # e.g., requirements.txt, package.json
├── packages/                # Shared code/libraries
│   ├── <shared_logic>/      # e.g., types, utils, config
│   └── <ui_library>/        # e.g., shared design system
├── package.json             # Root workspace manifest
├── turbo.json               # Pipeline and Caching configuration
└── vercel.json              # Global routing rules
```

### Technical Instructions

#### 1. Unified Routing (`vercel.json`)
The agent must ensure a `vercel.json` exists in the root to bridge the apps. The destination must point to the specific entry point within the backend app folder:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "apps/<backend_app>/<entry_point>.<ext>" },
    { "source": "/(.*)", "destination": "apps/<frontend_app>/index.html" }
  ]
}
```

#### 2. Workspace & Pipeline Management
- **Workspaces**: Define in root `package.json` (e.g., `"workspaces": ["apps/*", "packages/*"]`).
- **Turbo**: Define tasks in `turbo.json` (build, lint, dev) to handle dependencies between `packages/` and `apps/`.
- **Linking**: Use workspace references (e.g., `"@repo/ui": "*"`) for inter-package dependencies.

#### 3. Development Proxy Pattern
Configure the frontend dev server (e.g., `vite.config.ts`) to proxy `/api` requests to the backend:
- **Pattern**: `MATCH /api/*` -> `REDIRECT TO localhost:<backend_port>`
- **Logic**: Prevents CORS errors and allows relative fetching in the client.

#### 4. Runtime Detection
Identify the backend runtime based on the manifest inside `apps/<backend_app>/`:
- `package.json` -> Node.js
- `requirements.txt` / `Pipfile` -> Python
- `go.mod` -> Go

## Constraints
- **Circular Dependencies**: Never allow a package in `packages/` to depend on an application in `apps/`.
- **Stateless Backend**: Backend applications must be stateless (Serverless compliant).
- **Build Isolation**: Changes in one app should not trigger a rebuild of the other unless shared dependencies change.
- **Root-Level Config**: The `vercel.json` must always reside in the root directory for monorepo-wide routing.