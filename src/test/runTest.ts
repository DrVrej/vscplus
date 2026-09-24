import * as path from 'path';
import { spawn } from 'child_process';
import { downloadAndUnzipVSCode, runTests } from '@vscode/test-electron';

async function main() {
	try {
		// The folder containing the Extension Manifest package.json
		// Passed to `--extensionDevelopmentPath`
		const extensionDevelopmentPath = path.resolve(__dirname, '../../../');

		// Launch the extension normally using the VS Code build in .vscode-test
		if (process.argv.includes('--run')) {
			const vscodeExecutablePath = await downloadAndUnzipVSCode();
			/*const child =*/ spawn(vscodeExecutablePath, [
				`--extensionDevelopmentPath=${extensionDevelopmentPath}`,
				`--user-data-dir=${path.join(extensionDevelopmentPath, '.vscode-test', 'user-data')}`,
				`--extensions-dir=${path.join(extensionDevelopmentPath, '.vscode-test', 'extensions')}`
			], { /*detached: true,*/ stdio: 'inherit' });
			//child.unref();
			return;
		}

		// The path to the extension test script
		// Passed to --extensionTestsPath
		const extensionTestsPath = path.resolve(__dirname, './suite/index');

		// Download VS Code, unzip it and run the integration test
		await runTests({ extensionDevelopmentPath, extensionTestsPath });
	} catch (error) {
		console.error('Failed to run tests:', error);
		process.exit(1);
	}
}

main();