const path = require('path');

/** @typedef {import('webpack').Configuration} WebpackConfig **/

/** @type WebpackConfig */
const webExtensionConfig = {
	mode: 'none',
	target: 'webworker',
	entry: {
		extension: './src/extension.ts',
		'test/suite/index': './src/test/suite/index.ts'
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, './dist/web'),
		libraryTarget: 'commonjs',
		devtoolModuleFilenameTemplate: '../../[resource-path]'
	},
	resolve: {
		mainFields: ['browser', 'module', 'main'],
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader'
					}
				]
			}
		]
	},
	externals: {
		vscode: 'commonjs vscode'
	},
	performance: {
		hints: false
	},
	devtool: 'nosources-source-map'
};

module.exports = [webExtensionConfig];