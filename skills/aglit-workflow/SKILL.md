---
name: aglit-workflow
description: Use AGLIT issue/project workflow in repos with `.aglit/`. Trigger for planning/tracking work, creating/updating/listing issues or projects, choosing next issue, validating AGLIT state, or editing `.aglit/issues/*.md` and `.aglit/projects/*.md` with correct frontmatter and `projectId` linking.
---

# AGLIT Workflow

Use `aglit` for create/list/validate actions. Edit issue/project markdown files directly for content changes.

## Runbook

1. If `.aglit/` is missing, run `aglit init --prefix <PREFIX>`.
2. If asked what to work on, run `aglit list` (or `aglit list --group none`).
3. If project context is needed, run `aglit projects` and filter by slug if needed.
4. If no matching issue exists, create one with `aglit new`.
5. Edit `.aglit/issues/*.md` or `.aglit/projects/*.md` with file tools.
6. Before handoff on major updates, run `aglit check`.

## Invariants

- Keep required frontmatter keys valid and YAML parseable.
- `id` and `projectId` must be UUIDv7 strings.
- Link issue to project with `projectId` only (never slug).
- Resolve slug -> id via `aglit new --project <slug>` or project frontmatter.
- Treat `aglit check` warnings/errors as action items unless the user explicitly defers.

## Common Flows

- Create project + first issue: `aglit project new "<Title>"` -> `aglit new "<Issue Title>" --project <slug>` -> `aglit list --project <slug>`.
- Choose next issue: run `aglit list`; prefer `active`, then `planned`, unless user says otherwise; keep `## Plan` and `## Verification` updated.
- Validate handoff: run `aglit check`; if clean, report issue/project counts and key updates; if not clean, fix and rerun.

## References

- `references/commands.md`
- `references/file-format.md`
