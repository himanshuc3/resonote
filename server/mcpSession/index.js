import { MCPClient } from "mcp-client";

let mcpSession;

async function initMcpClient() {
  mcpSession = new MCPClient({ name: "Resonote", version: "0.1" });
  await mcpSession.connect({
    type: "stdio",
    command: "/home/anonymous/Desktop/projects/resonote/mcp-node/app",
    args: ["start-server", "--allow-tools=searchSingleIndex,listIndices"],
  });
  await mcpSession.ping();
  const tools = await mcpSession.getAllTools();
  console.log("MCP session initialized", tools);
}

export async function startup() {
  await initMcpClient();
  // Other setup ...
}

export function getSession() {
  if (!mcpSession) {
    throw new Error("MCP session is not initialized");
  }
  return mcpSession;
}
