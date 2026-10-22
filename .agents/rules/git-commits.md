# Git Commit Message Standards

Whenever creating or proposing a git commit message, strictly adhere to these standards:

### 1. Format
```text
<type>(<scope>): <imperative description of core edit>

[Optional body for large/context-heavy edits]
- Scale: <minor | moderate | large>
- Specifics: <concise context on why and what was changed>
```

### 2. Commit Types
- `feat`: A new feature or user-facing functionality (e.g. `feat(movies): add search bar and filter controls`)
- `fix`: A bug fix or runtime error correction (e.g. `fix(image): use leading slash for public assets`)
- `docs`: Documentation updates only (e.g. `docs(readme): update project status and roadmap`)
- `style`: UI styling, CSS tweaks, or formatting that does not affect code logic (e.g. `style(layout): add glassmorphic header bar`)
- `refactor`: Code restructuring without bug fixes or new features
- `chore`: Configuration, tooling, dependencies, or maintenance (e.g. `chore(vscode): configure custom editor tab labels`)
- `test`: Adding or updating test cases

### 3. Core Requirements
- **Type Selection**: Carefully verify the nature of changes to pick the exact right type (`chore`, `feat`, `fix`, `docs`, `style`, `refactor`, `test`).
- **Core Edit**: The subject line must capture the single primary change directly in the imperative mood (e.g. "add custom editor labels" not "added" or "adds").
- **Scope**: Include the affected component, directory, or module in parentheses when applicable, e.g. `(readme)`, `(vscode)`, `(api)`.
- **Scale (Minor vs. Large)**:
  - **Minor**: Single-line commit message is sufficient.
  - **Large / Multi-file**: Add a concise body explaining key specifics, dependencies, and architectural impact.
- **Context & Specifics**: Always provide short, concrete specifics explaining *why* and *what* was adjusted when changes involve multiple files or configuration subtleties.
