import { CONFIG_SCHEMA } from "./constants";
import { configPath } from "./paths";
import { atomicWriteJson, ensureLayout, fileExists, readJsonFile } from "./io";

export interface Config {
  issuePrefix: string;
  schema?: string;
}

function normalizePrefix(value: string): string {
  const normalized = value.trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9]*$/.test(normalized)) {
    throw new Error("issuePrefix must start with a letter and contain only A-Z and 0-9");
  }
  return normalized;
}

export async function getConfig(rootDir?: string): Promise<Config | null> {
  const path = configPath(rootDir);
  if (!(await fileExists(path))) {
    return null;
  }
  const json = await readJsonFile(path);
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new Error(`Invalid AGLIT config at ${path}`);
  }
  const issuePrefix = (json as { issuePrefix?: unknown }).issuePrefix;
  if (typeof issuePrefix !== "string") {
    throw new Error(`Invalid AGLIT config at ${path}`);
  }
  return {
    issuePrefix: normalizePrefix(issuePrefix),
    schema:
      typeof (json as { schema?: unknown }).schema === "string"
        ? (json as { schema?: string }).schema
        : undefined,
  };
}

export async function setConfig(rootDir: string | undefined, config: Config) {
  if (!config || typeof config !== "object") {
    throw new Error("Invalid AGLIT config payload");
  }
  const issuePrefix = normalizePrefix(config.issuePrefix);
  await ensureLayout(rootDir);
  await atomicWriteJson(configPath(rootDir), {
    schema: CONFIG_SCHEMA,
    issuePrefix,
  });
}

export async function resolveIssuePrefix(
  rootDir: string | undefined,
  inputPrefix?: string,
): Promise<string> {
  const existing = await getConfig(rootDir);
  if (existing?.issuePrefix) {
    return existing.issuePrefix;
  }

  if (!inputPrefix) {
    throw new Error(
      "Issue prefix not set. Run `aglit init --prefix ABC` or `aglit new --prefix ABC`.",
    );
  }

  const prefix = normalizePrefix(inputPrefix);
  const config: Config = {
    issuePrefix: prefix,
  };
  await setConfig(rootDir, config);
  return prefix;
}
