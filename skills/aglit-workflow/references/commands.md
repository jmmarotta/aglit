# AGLIT Commands

## Syntax

```bash
aglit init --prefix <PREFIX>

aglit new "<TITLE>" [--status <inbox|planned|active|blocked|done|canceled>] [--priority <none|low|medium|high>] [--project <slug>] [--prefix <PREFIX>]

aglit project new "<TITLE>" [--slug <slug>]

aglit list [--group none] [--status <inbox|planned|active|blocked|done|canceled>] [--project <slug>]

aglit projects [--status <inbox|planned|active|blocked|done|canceled>]

aglit check
```

## Notes

- `aglit init` creates `.aglit/issues/`, `.aglit/projects/`, and `.aglit/config.json`.
- `aglit new` output: `<KEY> <absolute-path>`.
- `aglit new --project <slug>` resolves slug to project `id` and writes issue `projectId`.
- `aglit project new` output: `<slug> <absolute-path>`; slug is derived from title unless provided.
- `aglit list` groups by status by default; use `--group none` for flat output.
- `aglit projects` shows derived issue counts per project.
- `aglit check` reports `issues`, `projects`, `problems`, and each problem with level (`error` or `warning`) plus file path.
