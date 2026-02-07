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
- Issue sections: `## Description`, `## Acceptance`, `## Constraints`, `## Plan`, `## Verification`.
- Project sections: `## Description`, `## Scope`, `## Milestones`, `## Notes`.

## Editing constraints

- Preserve `schema` and `id` once created.
- Treat `id` and `projectId` as UUIDv7 strings.
- Link issues to projects by `projectId` only.
- Keep frontmatter parseable YAML.
- Keep filenames stable unless intentionally renaming keys/slugs.
