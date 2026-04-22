// @ts-nocheck
import pkg from '../package.json';

const external = Object.keys(pkg.dependencies ?? {});

const result = await Bun.build({
  entrypoints: ['src/main.ts'],
  outdir: 'dist',
  target: 'bun',
  external,
});

if (!result.success) {
  for (const log of result.logs) console.error(log);
  process.exit(1);
}
