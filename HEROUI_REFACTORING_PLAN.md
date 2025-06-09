# HeroUI Component Migration Plan

## Overview
This document outlines a step-by-step plan to refactor the Agent Flow application from shadcn/ui to HeroUI components with full theme management support.

## Phase 1: Setup & Configuration
### 1.1 Install HeroUI Dependencies
```bash
npm install @heroui/react framer-motion@^11.9
```

### 1.2 Configure Tailwind CSS
- Update `tailwind.config.ts` to include HeroUI plugin
- Ensure dark mode is set to "class"
- Add HeroUI theme paths to content array

### 1.3 Create Theme Provider
- Implement `ThemeProvider` component with HeroUI
- Add theme toggle functionality
- Integrate with existing dark mode CSS variables

## Phase 2: Component Mapping & Migration Order

### Component Equivalents
| Current (shadcn/ui) | HeroUI Equivalent | Priority | Usage Count |
|---------------------|-------------------|----------|-------------|
| Button | Button | High | Multiple files |
| Input | Input | High | ToolsWindow, forms |
| Card | Card | High | Dashboard, nodes |
| Dialog | Modal | High | ToolsWindow |
| Label | Input (label prop) | Medium | Forms |
| Textarea | Textarea | Medium | Agent nodes |

### Migration Order (One Component at a Time)
1. **Button Component** (Most used)
   - Files: ToolsWindow, AgentBuilder, login page
   - Features: Variants, sizes, loading states
   
2. **Input Component**
   - Files: ToolsWindow, login forms
   - Features: Error states, icons, validation
   
3. **Card Component**
   - Files: Dashboard, workflow patterns
   - Features: Shadows, borders, hover effects
   
4. **Dialog → Modal**
   - Files: ToolsWindow (tools dialog)
   - Features: Backdrop, animations, sizes
   
5. **Label Integration**
   - Merge with Input components
   - Use HeroUI's built-in label support
   
6. **Textarea Component**
   - Files: Agent nodes, prompt inputs
   - Features: Auto-resize, character count

## Phase 3: Theme System Implementation

### 3.1 Theme Structure
```tsx
// lib/theme/theme-config.ts
export const heroUIThemes = {
  light: {
    colors: {
      // Map existing CSS variables to HeroUI theme
    }
  },
  dark: {
    colors: {
      // Map existing dark mode variables
    }
  }
}
```

### 3.2 Theme Provider Setup
- Wrap app with HeroUIProvider
- Implement theme persistence (localStorage)
- Add theme toggle component

### 3.3 Framer Motion Integration
- Already installed (motion package)
- Use for page transitions
- Enhance component animations
- Keep existing glow-effect animations

## Phase 4: Custom Components

### Preserve Custom Components
These components don't have HeroUI equivalents and should be kept:
- glow-effect.tsx (already uses Framer Motion)
- gradient-tracing.tsx
- meteors.tsx
- neon-gradient-card.tsx
- squares-background.tsx

## Phase 5: Testing & Validation

### Per-Component Testing
1. Visual regression testing
2. Functionality testing
3. Theme switching verification
4. Accessibility compliance

## Implementation Timeline

### Week 1: Foundation
- [ ] Day 1-2: Setup HeroUI, configure Tailwind
- [ ] Day 3-4: Implement ThemeProvider
- [ ] Day 5: Create theme toggle UI

### Week 2: Core Components
- [ ] Day 1-2: Migrate Button component
- [ ] Day 3-4: Migrate Input component
- [ ] Day 5: Migrate Card component

### Week 3: Complex Components
- [ ] Day 1-2: Migrate Dialog to Modal
- [ ] Day 3: Integrate Labels
- [ ] Day 4-5: Migrate Textarea

### Week 4: Polish & Testing
- [ ] Day 1-2: Theme refinement
- [ ] Day 3-4: Testing & bug fixes
- [ ] Day 5: Documentation update

## Migration Checklist

### Pre-Migration
- [ ] Backup current implementation
- [ ] Document current component props/APIs
- [ ] List all component variations used

### During Migration
- [ ] Maintain backwards compatibility
- [ ] Test each component in isolation
- [ ] Verify theme switching works
- [ ] Check accessibility features

### Post-Migration
- [ ] Remove old shadcn/ui components
- [ ] Update import statements
- [ ] Clean up unused dependencies
- [ ] Update documentation

## Risk Mitigation

### Potential Issues
1. **Breaking Changes**: Create adapter components if needed
2. **Style Conflicts**: Use CSS modules or scoped styles
3. **Missing Features**: Extend HeroUI components as needed
4. **Performance**: Monitor bundle size changes

### Rollback Strategy
- Keep shadcn/ui components until full migration
- Use feature flags for gradual rollout
- Maintain git branches for each phase

## Success Criteria
- [ ] All components migrated successfully
- [ ] Theme switching works seamlessly
- [ ] No visual regressions
- [ ] Performance maintained or improved
- [ ] Accessibility standards met
- [ ] Code is cleaner and more maintainable