# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
Agent Flow is a visual workflow builder for AI agents built with Next.js. It allows users to create, test, and deploy AI-powered automation workflows through a drag-and-drop interface.

## Common Commands
```bash
npm run dev    # Start development server on localhost:3000
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Architecture

### Technology Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Workflow Engine**: ReactFlow for visual builder, LangGraph + LangChain for execution
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth (magic links)
- **Tool Integration**: Composio SDK

### Core Components

#### Node Types (`components/builder-nodes/`)
- **InputNode**: Workflow entry point, accepts initial data
- **LLMNode**: Processes data through AI models (OpenAI, Anthropic, Google)
- **ComposioNode**: Executes external tools/integrations
- **AgentNode**: Combines LLM with tool access
- **OutputNode**: Displays final results

#### Workflow Patterns (`components/workflow-patterns/`)
Pre-built templates demonstrating common AI agent architectures:
- Augmented LLM (LLM + Tools)
- Prompt Chaining (Sequential processing)
- Routing (Conditional execution)
- Parallelization (Concurrent agents)
- Evaluator-Optimizer (Iterative refinement)

### Key Routes
- `/app/builder/[flowId]/page.tsx`: Main workflow builder interface
- `/app/api/agent/route.ts`: Workflow execution endpoint
- `/app/api/composio-tools/route.ts`: Tool discovery and management
- `/app/api/chat-to-agent/route.ts`: Natural language to workflow conversion

### Data Flow
1. User creates visual workflow in builder
2. Workflow saved as JSON graph to Supabase
3. Execution triggered via UI or API
4. LangGraph processes nodes sequentially/in parallel
5. Results streamed back to client

### Database Schema
The application requires a `flows` table in Supabase. See `supabase-setup.sql` for complete schema.

## Development Guidelines

### When modifying nodes:
- All nodes extend base patterns in `builder-nodes/`
- Node data changes trigger re-renders via `nodeId` prop
- Tools are fetched dynamically from Composio API

### When working with workflows:
- Workflows are stored as ReactFlow JSON graphs
- Each node has `id`, `type`, `position`, and `data` properties
- Edges define connections between nodes

### API Integration:
- LLM providers configured per-node (not globally)
- Composio API key can be set globally or per-session
- All API routes support streaming responses

### State Management:
- ReactFlow handles graph state
- Individual nodes manage their own configuration
- No global state management library used