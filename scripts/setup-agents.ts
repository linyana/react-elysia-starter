import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { createInterface } from 'readline';

const root = join(import.meta.dirname, '..');
const agentsDir = join(root, '.agents');
const configPath = join(agentsDir, 'config.json');

type Mapping = { source: string; target: string };

type Platform = {
	name: string;
	mappings: Mapping[];
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

function prompt(question: string): Promise<string> {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer.trim());
		});
	});
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
		Bun.spawnSync(['cmd', '/c', 'mklink', '/J', target, source]);
	} else {
		Bun.spawnSync(['ln', '-s', source, target]);
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
				console.log(`  ✓ ${target} -> .agents/${source}`);
				created++;
			} else {
				skipped++;
			}
		}
	}

	if (created > 0) console.log(`\n  ${created} link(s) created.`);
	if (skipped > 0 && created === 0) console.log('  All links already exist.');
}

async function interactiveSetup() {
	console.log('\n  Agent Rules Setup\n');
	console.log('  Select the AI tools you use (comma-separated):\n');

	PLATFORMS.forEach((p, i) => {
		const features = p.mappings.map((m) => m.source).join(', ');
		console.log(`    ${i + 1}. ${p.name}  (${features})`);
	});

	console.log('');
	const answer = await prompt('  > ');

	const indices = answer
		.split(/[,\s]+/)
		.map((s) => parseInt(s, 10) - 1)
		.filter((i) => i >= 0 && i < PLATFORMS.length);

	if (indices.length === 0) {
		console.log('\n  No platforms selected. Run `bun run setup` to try again.\n');
		return;
	}

	const selected = indices.map((i) => PLATFORMS[i].name);

	console.log(`\n  Selected: ${selected.join(', ')}\n`);

	writeFileSync(configPath, JSON.stringify({ platforms: selected }, null, 2));
	applyConfig(selected);

	console.log('');
}

async function main() {
	if (existsSync(configPath)) {
		const config = JSON.parse(readFileSync(configPath, 'utf-8'));
		applyConfig(config.platforms);
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
