# Generated by https://smithery.ai. See: https://smithery.ai/docs/config#dockerfile
# Start with a Node.js base image
FROM node:20-alpine AS builder

# Set the working directory inside the Docker container
WORKDIR /app

# Copy the package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./

# Install pnpm, a fast, disk space-efficient package manager
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the entire project to the working directory
COPY . .

# Build the TypeScript project
RUN pnpm build

# Use a smaller Node.js base image for the final image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist /app/dist

# Copy the node_modules from the builder stage
COPY --from=builder /app/node_modules /app/node_modules

# Copy the package.json file
COPY --from=builder /app/package.json /app/package.json

# Set environment variable for Perplexity API Key
# It's advised to set this as a secret during runtime instead of hardcoding here
ENV PERPLEXITY_API_KEY=your_api_key_here

# Run the server
ENTRYPOINT ["node", "dist/index.js"]
