# AGLIT File Format

## Paths

- Issues: `.aglit/issues/<PREFIX>-<N>.md`
- Projects: `.aglit/projects/<slug>.md`

## Enums

- `status`: `inbox|planned|active|blocked|done|canceled`
- `priority`: `none|low|medium|high`

## Required issue frontmatter

```yaml
---
schema: aglit.issue.md.v1
id: <uuidv7>
status: <status>
priority: <priority>
projectId: <uuidv7> # optional
---
```

## Required project frontmatter

```yaml
---
schema: aglit.project.md.v1
id: <uuidv7>
status: <status>
priority: <priority>
---
```

## Body conventions

- First heading must be `# <title>`.
- Baseline issue sections: `## Description`, `## Acceptance`, `## Constraints`, `## Plan`, `## Verification`.
- Baseline project sections: `## Description`, `## Scope`, `## Milestones`, `## Notes`.
- Agents may add additional sections when useful, including but not limited to `## Design Intent (APOSD)`, `## Boundary Ownership`, `## Proposed Interfaces`, and `## State Invariants`; agents may add other section headings not listed here when they determine they are necessary.
- Required and optional sections should be thorough and comprehensive while remaining concise, leaving no open questions for implementation, verification, or handoff.

## Editing constraints

- Preserve `schema` and `id` once created.
- Treat `id` and `projectId` as UUIDv7 strings.
- Link issues to projects by `projectId` only.
- Keep frontmatter parseable YAML.
- Keep filenames stable unless intentionally renaming keys/slugs.
