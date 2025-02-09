import winston from "winston";
import path from "path";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(process.cwd(), "perplexity-mcp.log")
    })
  ]
}); 
