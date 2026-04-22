FROM oven/bun:1.3.0-alpine

WORKDIR /app

ENV PATH="/root/.bun/bin:$PATH"

COPY . ./

RUN bun install && \
    bun run prisma:generate && \
    bun run build:api

CMD bun run prisma:push && \
    bun run api/dist/main.js