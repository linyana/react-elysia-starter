# React + Elysia Starter

Full-stack monorepo starter with **React 19**, **Elysia**, **Prisma**, and **Ant Design** — powered by Bun.

## Quick Start

```bash
# Install dependencies
bun install

# Start PostgreSQL & Redis
docker compose up -d

# Push database schema
bun run prisma:push

# Start dev servers (frontend + backend)
bun dev
```

## AI Tool Setup

This project ships shared AI coding rules and skills in the `.agents/` directory. Run the setup script to sync them to your preferred AI tool(s):

```bash
bun run setup
```

You'll see an interactive prompt:

```
Agent Rules Setup

Select the AI tools you use (comma-separated):

  1. Claude Code  (rules, skills)
  2. Cursor  (rules)
  3. Windsurf  (rules)
  4. Cline  (rules)
  5. Continue  (rules)
  6. Augment  (rules)
  7. Trae  (rules, skills)

> 1,2
```

The script creates directory junctions (Windows) or symlinks (Unix) from each tool's config directory to the shared `.agents/` source. Your selection is saved to `.agents/config.json` so subsequent `bun install` runs are automatic.

### `.agents/` structure

```
.agents/
├── rules/          # Shared coding rules (synced to all selected tools)
├── skills/         # Code generation skills (Claude Code, Trae)
└── config.json     # Your platform selection (gitignored)
```

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start frontend and backend dev servers |
| `bun run build` | Build all packages |
| `bun run lint` | Run oxlint |
| `bun run format` | Format with vite-plus |
| `bun run prisma:push` | Push Prisma schema to database |
| `bun run prisma:generate` | Regenerate Prisma client |
| `bun run setup` | Configure AI tool integrations |
