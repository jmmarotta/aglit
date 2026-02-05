import { buildApplication } from "@stricli/core";

import { routes } from "./routes";

export const app = buildApplication(routes, {
  name: "aglit",
  scanner: { caseStyle: "allow-kebab-for-camel" },
});
