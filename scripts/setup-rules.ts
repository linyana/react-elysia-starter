import { existsSync, lstatSync } from 'fs';
import { join } from 'path';

const root = join(import.meta.dirname, '..');
const source = join(root, '.agents', 'rules');
const targets = [
	join(root, '.claude', 'rules'),
	join(root, '.cursor', 'rules'),
];

for (const target of targets) {
	if (existsSync(target)) {
		const stat = lstatSync(target);
		if (stat.isSymbolicLink() || stat.isDirectory()) {
			console.log(`  skip: ${target} (already exists)`);
			continue;
		}
	}

	const parent = join(target, '..');
	if (!existsSync(parent)) {
		await Bun.$`mkdir ${parent}`;
	}

	if (process.platform === 'win32') {
		await Bun.$`cmd /c mklink /J ${target} ${source}`;
	} else {
		await Bun.$`ln -s ${source} ${target}`;
	}

	console.log(`  link: ${target} -> ${source}`);
}
