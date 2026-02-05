import { buildRouteMap } from "@stricli/core";

import { initCommand } from "./commands/init";
import { checkCommand } from "./commands/check";
import { listCommand } from "./commands/list";
import { newCommand } from "./commands/new";
import { projectNewCommand } from "./commands/project-new";
import { projectsCommand } from "./commands/projects";

const projectRoutes = buildRouteMap({
  routes: {
    new: projectNewCommand,
  },
  docs: {
    brief: "Project commands",
  },
});

export const routes = buildRouteMap({
  routes: {
    init: initCommand,
    new: newCommand,
    list: listCommand,
    projects: projectsCommand,
    project: projectRoutes,
    check: checkCommand,
  },
  docs: {
    brief: "AGLIT CLI",
  },
});
