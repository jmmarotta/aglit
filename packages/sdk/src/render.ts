import type { BoardView, IssueSummary, ProjectsView } from "./views";

export function renderBoard(view: BoardView): string {
  const lines: string[] = [];
  for (const group of view.groups) {
    lines.push(`${group.status} (${group.issues.length})`);
    for (const issue of group.issues) {
      lines.push(`- ${issue.key}: ${issue.title} [${issue.priority}]`);
    }
    lines.push("");
  }
  return lines.join("\n").trimEnd();
}

export function renderList(issues: IssueSummary[]): string {
  if (!issues.length) {
    return "No issues.";
  }
  return issues
    .map((issue) => `- ${issue.key}: ${issue.title} [${issue.status}] [${issue.priority}]`)
    .join("\n");
}

export function renderProjects(view: ProjectsView): string {
  if (!view.projects.length) {
    return "No projects.";
  }
  return view.projects
    .map(
      (project) =>
        `- ${project.slug}: ${project.title} [${project.status}] [${project.priority}] (issues: ${project.issueCount})`,
    )
    .join("\n");
}
