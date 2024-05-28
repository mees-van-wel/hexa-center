FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Necessary dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libexpat1 \
    libgbm1 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libuuid1 \
    libx11-6 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxkbcommon0 \
    libxrandr2 \
    libxrender1 \
    libxshmfence1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    xdg-utils \
    --no-install-recommends && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN wget -qO- https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable

FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN pnpm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/emails ./emails
COPY --from=builder /app/src/pdfs ./pdfs
COPY --from=builder /app/src/soapEnvelopes ./soapEnvelopes
COPY --from=builder /app/drizzle ./drizzle

EXPOSE 3001

ENV PORT 3001 \
    HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]