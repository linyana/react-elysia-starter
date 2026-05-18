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

Select the AI tools you use:

> [ ] Claude Code  (rules, skills)
  [ ] Cursor  (rules)
  [ ] Windsurf  (rules)
  [ ] Cline  (rules)
  [ ] Continue  (rules)
  [ ] Augment  (rules)
  [ ] Trae  (rules, skills)

Up/Down: move   Space: toggle   A: toggle all   Enter: confirm   Esc: cancel
```

Use the keyboard to select one or more tools. The script creates directory junctions (Windows) or symlinks (Unix) from each tool's config directory to the shared `.agents/` source. Your selection is saved to `.agents/config.json`; if it does not include every platform currently defined in the setup script, the next interactive run lets you continue selecting from the existing choices.

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
