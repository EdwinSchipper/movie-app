<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git Commit Message Guidelines

Always format git commit messages with clear conventional types, core edit focus, scale assessment (minor vs. large), and specific context:

### 1. Format
```text
<type>(<scope>): <imperative description of core edit>

[Optional body for large/context-heavy edits]
- Scale: <minor | moderate | large>
- Specifics: <concise context on why and what was changed>
```

### 2. Types
- `feat`: A new feature or user-facing functionality (e.g. `feat(movies): add search bar and filter controls`)
- `fix`: A bug fix or runtime error correction (e.g. `fix(image): use leading slash for public assets`)
- `docs`: Documentation only changes (e.g. `docs(readme): update project status and roadmap`)
- `style`: CSS/styling or formatting that does not affect code logic (e.g. `style(layout): add glassmorphic header bar`)
- `refactor`: Code restructuring without bug fixes or new features
- `chore`: Configuration, tooling, dependencies, or maintenance (e.g. `chore(vscode): configure custom editor tab labels`)
- `test`: Adding or updating test cases

### 3. Guidelines
- **Core Edit**: Summarize the primary change concisely in imperative mood (e.g. "add", "fix", "update", not "added" or "updates").
- **Scope**: Identify the core component, route, or file group (e.g., `(readme)`, `(vscode)`, `(api)`).
- **Scale (Minor vs. Large)**:
  - **Minor**: Single-line commit message is sufficient.
  - **Large / Multi-file**: Add a bulleted body explaining key specifics, dependencies, and architectural context.
- **Context & Specifics**: Include the "why" or critical nuances whenever changes affect setup, configs, or public APIs.
