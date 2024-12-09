# Use the official Node.js 18 image as a base
FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install Chromium
RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Set the working directory
WORKDIR /workspaces

# Default command
CMD ["sleep", "infinity"]
