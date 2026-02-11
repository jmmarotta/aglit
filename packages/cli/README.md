# aglit

AGLIT is a file-based issue and project tracker for code repositories.

It stores data in a local `.aglit/` directory, so you can track work in Markdown,
keep everything in git, and avoid external services.

## Install

```bash
bun add -g aglit
# or
npm install -g aglit
```

Run without installing:

```bash
bunx aglit@latest --help
```

## Quick start

```bash
# from your repository
aglit init --prefix AGL

# create a project
aglit project new "Release process cleanup"

# create an issue (linked to a project by slug)
aglit new --project release-process-cleanup --priority high "Fix publish auth flow"

# list work
aglit list
aglit projects

# validate files and references
aglit check
```

## Commands

```text
aglit init [--prefix <value>]
aglit new [--status <value>] [--priority <value>] [--project <slug>] [--prefix <value>] <title>
aglit list [--status <value>] [--project <slug>] [--group status|none]
aglit projects [--status <value>]
aglit project new [--status <value>] [--priority <value>] [--slug <value>] <title>
aglit check
```

- `init`: creates `.aglit/` layout and saves `issuePrefix` in `.aglit/config.json`.
- `new`: creates `.aglit/issues/<PREFIX-N>.md`.
- `project new`: creates `.aglit/projects/<slug>.md`.
- `list`: prints a status board by default (`--group status`) or a flat list (`--group none`).
- `projects`: lists projects with issue counts.
- `check`: validates schemas, IDs, status/priority values, and project references.

## Data layout

```text
.aglit/
  config.json
  issues/
    AGL-1.md
  projects/
    release-process-cleanup.md
```

The CLI searches upward from your current directory to find the workspace root
that contains `.aglit/`, so you can run commands from nested folders.

## Allowed values

- Status: `inbox`, `planned`, `active`, `blocked`, `done`, `canceled`
- Priority: `none`, `low`, `medium`, `high`

## Notes

- If no config exists, `aglit new --prefix ABC "..."` will initialize and store the prefix.
- Project linkage uses `projectId` internally; use project slug on the CLI via `--project`.
