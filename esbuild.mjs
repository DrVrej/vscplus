import * as esbuild from 'esbuild';

const production = process.argv.includes('--production');
const entryPoints = {
	extension: './src/extension.ts'
};

// The web test runner is only needed during development and testing.
if (!production) {
	entryPoints['test/suite/index'] = './src/test/suite/index.ts';
}

const options = {
	entryPoints,
	bundle: true,
	platform: 'browser',
	format: 'cjs',
	target: 'es2024',
	external: ['vscode'],
	outdir: 'out/web',
	minify: production,
	sourcemap: production ? false : 'linked',
	sourcesContent: false,
	logLevel: 'info'
};

if (process.argv.includes('--watch')) {
	const context = await esbuild.context(options);
	await context.watch();
} else {
	await esbuild.build(options);
}