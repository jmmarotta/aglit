import { type Plugin } from "@opencode-ai/plugin";

import { buildAglitProtocol } from "./prompt";

const AglitPlugin: Plugin = async () => {
  return {
    "experimental.chat.system.transform": async (input, output) => {
      const protocol = buildAglitProtocol();
      const system = Array.isArray(output.system) ? output.system : [];
      system.push(protocol);
      output.system = system;
    },
  };
};

export default AglitPlugin;
