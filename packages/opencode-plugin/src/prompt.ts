export function buildAglitProtocol(): string {
  return [
    "AGLIT protocol:",
    "- Canonical store: .aglit/issues/*.md and .aglit/projects/*.md.",
    "- Use `aglit list`, `aglit projects`, `aglit new`, `aglit project new` via bash.",
    "- Edit issue/project Markdown directly with file tools.",
    "- Issue frontmatter links projects via projectId (UUIDv7).",
    "- Issues are ordered by priority (high -> medium -> low -> none).",
    "- Multiple active issues are allowed.",
    "- Issue keys are sequential and use the configured issuePrefix.",
  ].join("\n");
}
