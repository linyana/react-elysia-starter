const app = Bun.spawn(['bun', 'run', 'dev'], {
	cwd: 'app',
	stdout: 'inherit',
	stderr: 'inherit',
});

// Wait for Vite to be ready
const port = 5173;
const maxRetries = 30;
for (let i = 0; i < maxRetries; i++) {
	try {
		await fetch(`http://localhost:${port}`);
		break;
	} catch {
		await Bun.sleep(300);
	}
}

const api = Bun.spawn(['bun', 'run', 'dev'], {
	cwd: 'api',
	stdin: 'inherit',
	stdout: 'inherit',
	stderr: 'inherit',
});

await Promise.all([app.exited, api.exited]);
export {};
