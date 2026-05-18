import { spawnSync } from 'child_process';
import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { clearScreenDown, cursorTo, emitKeypressEvents } from 'readline';

const root = join(import.meta.dirname, '..');
const agentsDir = join(root, '.agents');
const configPath = join(agentsDir, 'config.json');

type Mapping = { source: string; target: string };

type Platform = {
	name: string;
	mappings: Mapping[];
};

type Config = {
	platforms?: unknown;
};

const PLATFORMS: Platform[] = [
	{
		name: 'Claude Code',
		mappings: [
			{ source: 'rules', target: '.claude/rules' },
			{ source: 'skills', target: '.claude/skills' },
		],
	},
	{
		name: 'Cursor',
		mappings: [{ source: 'rules', target: '.cursor/rules' }],
	},
	{
		name: 'Windsurf',
		mappings: [{ source: 'rules', target: '.windsurf/rules' }],
	},
	{
		name: 'Cline',
		mappings: [{ source: 'rules', target: '.cline/rules' }],
	},
	{
		name: 'Continue',
		mappings: [{ source: 'rules', target: '.continue/rules' }],
	},
	{
		name: 'Augment',
		mappings: [{ source: 'rules', target: '.augment/rules' }],
	},
	{
		name: 'Trae',
		mappings: [
			{ source: 'rules', target: '.trae/rules' },
			{ source: 'skills', target: '.trae/skills' },
		],
	},
];

const PLATFORM_NAMES = PLATFORMS.map((p) => p.name);

function readConfig(): Config | undefined {
	try {
		return JSON.parse(readFileSync(configPath, 'utf-8'));
	} catch {
		return undefined;
	}
}

function normalizePlatforms(value: unknown) {
	if (!Array.isArray(value)) return [];

	return [...new Set(value)]
		.filter((name): name is string => typeof name === 'string')
		.filter((name) => PLATFORM_NAMES.includes(name));
}

function hasCompletePlatformSelection(config: Config) {
	const platforms = normalizePlatforms(config.platforms);

	return (
		platforms.length === PLATFORM_NAMES.length &&
		PLATFORM_NAMES.every((name) => platforms.includes(name))
	);
}

function writeConfig(platforms: string[]) {
	writeFileSync(configPath, JSON.stringify({ platforms }, null, 2));
}

function link(source: string, target: string) {
	const targetDir = join(target, '..');
	if (!existsSync(targetDir)) {
		mkdirSync(targetDir, { recursive: true });
	}

	if (existsSync(target)) {
		const stat = lstatSync(target);
		if (stat.isSymbolicLink() || stat.isDirectory()) {
			return false;
		}
	}

	if (process.platform === 'win32') {
		spawnSync('cmd', ['/c', 'mklink', '/J', target, source]);
	} else {
		spawnSync('ln', ['-s', source, target]);
	}

	return true;
}

function applyConfig(selectedNames: string[]) {
	let created = 0;
	let skipped = 0;

	for (const name of selectedNames) {
		const platform = PLATFORMS.find((p) => p.name === name);
		if (!platform) continue;

		for (const { source, target } of platform.mappings) {
			const srcPath = join(agentsDir, source);
			const tgtPath = join(root, target);

			if (!existsSync(srcPath)) continue;

			if (link(srcPath, tgtPath)) {
				console.log(`  Created ${target} -> .agents/${source}`);
				created++;
			} else {
				skipped++;
			}
		}
	}

	if (created > 0) console.log(`\n  ${created} link(s) created.`);
	if (skipped > 0 && created === 0) console.log('  All links already exist.');
}

function selectPlatforms(currentPlatforms: string[]) {
	const selected = new Set(
		currentPlatforms
			.map((name) => PLATFORM_NAMES.indexOf(name))
			.filter((index) => index >= 0),
	);
	let cursor = selected.values().next().value ?? 0;
	let message = '';

	emitKeypressEvents(process.stdin);
	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdout.write('\x1B[?25l');

	const render = () => {
		cursorTo(process.stdout, 0, 0);
		clearScreenDown(process.stdout);

		console.log('\n  Agent Rules Setup\n');
		console.log('  Select the AI tools you use:\n');

		PLATFORMS.forEach((p, index) => {
			const active = index === cursor ? '>' : ' ';
			const checked = selected.has(index) ? 'x' : ' ';
			const features = p.mappings.map((m) => m.source).join(', ');
			console.log(`  ${active} [${checked}] ${p.name}  (${features})`);
		});

		console.log('');
		console.log(
			'  Up/Down: move   Space: toggle   A: toggle all   Enter: confirm   Esc: cancel',
		);
		if (message) console.log(`  ${message}`);
	};

	return new Promise<number[]>((resolve) => {
		const cleanup = () => {
			process.stdin.off('keypress', onKeypress);
			process.stdin.setRawMode(false);
			process.stdin.pause();
			process.stdout.write('\x1B[?25h');
		};

		const finish = (indices: number[]) => {
			cleanup();
			console.log('');
			resolve(indices);
		};

		const onKeypress = (
			input: string | undefined,
			key: { name?: string; ctrl?: boolean },
		) => {
			message = '';

			if (key.ctrl && key.name === 'c') {
				cleanup();
				console.log('\n\n  Setup cancelled.\n');
				process.exit(130);
			}

			if (key.name === 'escape') {
				finish([]);
				return;
			}

			if (key.name === 'up' || input === 'k') {
				cursor = (cursor - 1 + PLATFORMS.length) % PLATFORMS.length;
				render();
				return;
			}

			if (key.name === 'down' || input === 'j') {
				cursor = (cursor + 1) % PLATFORMS.length;
				render();
				return;
			}

			if (key.name === 'space') {
				if (selected.has(cursor)) selected.delete(cursor);
				else selected.add(cursor);
				render();
				return;
			}

			if (input?.toLowerCase() === 'a') {
				if (selected.size === PLATFORMS.length) selected.clear();
				else PLATFORMS.forEach((_, index) => selected.add(index));
				render();
				return;
			}

			if (key.name === 'return') {
				if (selected.size === 0) {
					message = 'Select at least one platform.';
					render();
					return;
				}

				finish([...selected].sort((a, b) => a - b));
			}
		};

		process.stdin.on('keypress', onKeypress);
		render();
	});
}

async function interactiveSetup(config?: Config) {
	const currentPlatforms = normalizePlatforms(config?.platforms);
	const indices = await selectPlatforms(currentPlatforms);

	if (indices.length === 0) {
		console.log('\n  Setup cancelled. Run `bun run setup` to try again.\n');
		return;
	}

	const selected = indices.map((i) => PLATFORMS[i].name);

	console.log(`\n  Selected: ${selected.join(', ')}\n`);

	writeConfig(selected);
	applyConfig(selected);

	console.log('');
}

async function main() {
	if (existsSync(configPath)) {
		const config = readConfig();

		if (config && hasCompletePlatformSelection(config)) {
			applyConfig(normalizePlatforms(config.platforms));
			return;
		}

		if (process.stdin.isTTY) {
			console.log(
				'\n  Agent setup config is missing platforms. Continue selecting below.\n',
			);
			await interactiveSetup(config);
			return;
		}

		console.log(
			'\n  Agent setup config is missing platforms. Run `bun run setup` to continue selecting.\n',
		);
		return;
	}

	if (process.stdin.isTTY) {
		await interactiveSetup();
	} else {
		console.log(
			'\n  Run `bun run setup` to configure AI tool integrations.\n',
		);
	}
}

main();
