// Edit these to taste. Left = original text emitted by vite-plugin-checker;

import { spawn } from "child_process";

// right = what you want to see instead. Errors and stack traces are NOT touched.
const green = "\x1b[32m";
const reset = "\x1b[0m";

const REPLACEMENTS: Array<[RegExp, string]> = [
	[
		/\[TypeScript\]\s*Found 0 errors\. Watching for file changes\./g,
		`[Typescript] ${green}✔${reset} APP Type passed`,
	],
];

const child = spawn(process.execPath, ["x", "vite", ...process.argv.slice(2)], {
	stdio: ["inherit", "pipe", "pipe"],
	env: { ...process.env, FORCE_COLOR: "1" },
});

const transform = (chunk: Buffer): string => {
	let s = chunk.toString();
	for (const [re, rep] of REPLACEMENTS) s = s.replace(re, rep);
	return s;
};

child.stdout?.on("data", (c) => process.stdout.write(transform(c)));
child.stderr?.on("data", (c) => process.stderr.write(transform(c)));

const forward = (sig: NodeJS.Signals) => {
	if (!child.killed) child.kill(sig);
};
process.on("SIGINT", () => forward("SIGINT"));
process.on("SIGTERM", () => forward("SIGTERM"));

child.on("exit", (code, signal) => {
	if (signal) process.kill(process.pid, signal);
	else process.exit(code ?? 0);
});
