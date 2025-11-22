# AGENTS.md

## Build/Lint/Test Commands
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint with auto-fix
- No test framework configured

## Code Style Guidelines
- Vue 3 Composition API with `<script setup>`
- ESLint with Vue essential rules
- Use @ alias for imports: `import Component from '@/components/Component.vue'`
- Component names: PascalCase (e.g., `Challenges.vue`)
- Props and refs: camelCase
- Environment variables: VUE_APP_* prefix
- Use TypeScript when available (not currently configured)
- Error handling: Try-catch blocks for async operations
- Styling: Scoped CSS with component-scoped classes