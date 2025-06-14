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
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS 3
- **UI Components**: HeroUI (migrating from shadcn/ui) with theme support
- **Theme Management**: next-themes + HeroUI themes (light/dark mode)
- **Workflow Engine**: ReactFlow for visual builder, LangGraph + LangChain for execution
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: Supabase Auth (magic links)
- **Tool Integration**: Composio SDK
- **Animation**: Framer Motion 11

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

## UI Component Migration (HeroUI)

### Migration Status
The application is being migrated from shadcn/ui to HeroUI components. A comprehensive refactoring plan is available in `HEROUI_REFACTORING_PLAN.md`.

### Completed Components
- **Button**: Fully migrated with variant mapping (default→solid/primary, destructive→solid/danger, etc.)
- **ThemeProvider**: Integrated with HeroUIProvider and next-themes for dark mode support
- **ThemeToggle**: Custom toggle component using HeroUI Button

### Theme System
- Light/dark mode support via `next-themes`
- CSS variables defined in `globals.css` for consistent theming
- HeroUI theme configuration in `tailwind.config.ts`
- Theme persistence in localStorage

### Component Usage
When using UI components:
- Import from `@/components/ui/` (these are being progressively migrated)
- Button component maintains shadcn/ui API but uses HeroUI underneath
- Theme toggle available via `<ThemeToggle />` component

### Migration Notes
- Tailwind CSS v3 is used (not v4) for HeroUI compatibility
- OKLCH colors converted to hex format in CSS variables
- Framer Motion animations preserved from original components
- Custom components (glow-effect, meteors, etc.) remain unchanged

## AI Command Bar Features

### Overview
The AI Command Bar (accessible via Cmd+K) provides intelligent workflow creation through natural language and contextual suggestions.

### Features
1. **Natural Language Processing**: Describe workflows in plain English, automatically converted to visual nodes
2. **Contextual AI Suggestions**: Smart recommendations based on current workflow state
3. **Quick Commands**: Pre-built patterns and common node types
4. **Workflow Preview**: See generated workflows before adding to canvas

### Contextual Suggestions
The AI Assistant analyzes your workflow and suggests:
- **Missing Essential Nodes**: Input/Output nodes when needed
- **Upgrade Paths**: Suggest Agent nodes when using LLMs
- **Tool Integration**: Recommend Composio tools for complex workflows
- **Pattern Recognition**: Suggest parallel processing for multi-step workflows

### Visual Indicators
- Orange dot on AI Assistant button indicates available suggestions
- Suggested commands highlighted with warning color in command palette
- Border indicators for contextual recommendations

### Usage
- Press `Cmd+K` or click "AI Assistant" button
- Type natural language description or select from suggestions
- Preview generated workflow before adding
- Suggestions update in real-time as you build