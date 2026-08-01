# Playwright's official image already includes Node.js, all three
# browsers (Chromium/Firefox/WebKit), and every OS-level dependency they
# need — this is the single biggest reason to containerize tests: no more
# "works on my machine" browser installation issues (like the missing
# executable / Node version mismatches you'd hit installing locally).
FROM mcr.microsoft.com/playwright:v1.47.0-jammy

WORKDIR /app

# Copy dependency manifests first so Docker can cache the npm install
# layer — rebuilds are fast as long as package.json hasn't changed.
COPY package*.json ./
RUN npm ci

# Now copy the rest of the project.
COPY . .

# Default command: run the full suite. Overridden at `docker run` time
# for different projects/tags (see README for examples).
CMD ["npx", "playwright", "test"]
