import * as path from 'path';
import Mocha = require('mocha');
import { glob } from 'glob';

export async function run(): Promise<void> {
	// Create the mocha test
	const mocha = new Mocha({
		ui: 'tdd'
	});

	const testsRoot = path.resolve(__dirname, '..');

	const files = await glob('**/**.test.js', {
		cwd: testsRoot,
		nodir: true
	});

	// Add files to the test suite
	files.forEach((file: string) => {
		mocha.addFile(path.resolve(testsRoot, file));
	});

	return new Promise<void>((resolve, reject) => {
		try {
			// Run the mocha test
			mocha.run((failures: number) => {
				if (failures > 0) {
					reject(new Error(`${failures} tests failed.`));
				} else {
					resolve();
				}
			});
		} catch (err) {
			console.error(err);
			reject(err);
		}
	});
}