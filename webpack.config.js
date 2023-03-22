const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'public/js'),
	},
	devtool: 'source-map',
	devServer: {
		static: {
			directory: path.resolve(__dirname, './'),
		},
	},
};

