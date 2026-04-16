FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lock* ./
COPY api/package.json api/
COPY app/package.json app/

RUN bun install --frozen-lockfile

COPY . .

RUN cd api && bun run prisma:generate

EXPOSE 3000

CMD ["bun", "run", "--cwd", "api", "src/main.ts"]
