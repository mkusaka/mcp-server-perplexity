#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { OpenAI } from "openai";
import { logger } from "./lib/logger.js";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
if (!PERPLEXITY_API_KEY) {
  logger.error("PERPLEXITY_API_KEY is required");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai"
});

const server = new McpServer({
  name: "perplexity-mcp",
  version: "0.1.0"
});

const MODELS = [
  "sonar-reasoning-pro",
  "sonar-reasoning",
  "sonar-pro",
  "sonar"
] as const;

// Search tool with validation
server.tool(
  "perplexity_search",
  "Search using Perplexity AI's models with context-aware responses and citations",
  {
    query: z.string().min(1),
    model: z.enum(MODELS).default("sonar").describe("Model to use (sonar-reasoning-pro, sonar-reasoning, sonar-pro, sonar)"),
    count: z.number().min(1).max(10).optional().default(5)
  },
  async ({ query, model, count }) => {
    try {
      logger.info(`Performing search with model ${model}: ${query}`);
      const response = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: query }],
        max_tokens: count * 100
      });

      return {
        content: [{ 
          type: "text", 
          text: response.choices[0]?.message.content || "No results found"
        }]
      };
    } catch (error) {
      logger.error("Search error:", error);
      return {
        content: [{ 
          type: "text", 
          text: `Error performing search: ${error instanceof Error ? error.message : String(error)}`
        }],
        isError: true
      };
    }
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
logger.info("Perplexity MCP Server started"); 
