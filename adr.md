# Architectural Decision Records

## 1. MCP Server Implementation for Perplexity AI - 2024-02-14

### Status
Accepted

### Context
We need to implement an MCP server for Perplexity AI to enable integration with Claude and other LLM applications. The server should provide search capabilities using Perplexity's API while maintaining good logging and error handling.

### Decision
We decided to:
1. Use the OpenAI SDK with a custom base URL since Perplexity AI provides OpenAI-compatible endpoints
2. Implement Winston logger with file output to avoid console pollution
3. Use Zod for input validation with strict model type checking
4. Support all official Perplexity models (sonar series) with enum validation
5. Follow the latest MCP TypeScript SDK patterns for server implementation

### Technical Details
- Logger outputs to `perplexity-mcp.log` instead of stdout/stderr
- Models are strictly typed using a const array and Zod enum
- Tool parameters include:
  - query (required string)
  - model (enum with default "sonar")
  - count (optional number 1-10, default 5)
- Error handling includes both logging and user-friendly error messages

### Consequences
Positive:
- Type-safe model selection
- Clean separation of logs from MCP communication
- Easy to test using MCP Inspector
- Maintainable codebase with clear error handling

Negative:
- Need to update model list manually when Perplexity adds new models
- Single log file might need rotation in production

### References
- [Perplexity AI Documentation](https://docs.perplexity.ai)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) 
