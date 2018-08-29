
const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');

const PRODUCTION = process.argv.includes('-p');
const VERBOSE = process.argv.includes('--verbose');

const SCRIPTS_ROOT = 'grip/scripts';
const env = PRODUCTION ? 'production' : 'development';

module.exports = {
	entry: {
		popup: 'src/popup.tsx',
		content: 'src/content.tsx',
		background: 'src/background.ts',
	},
	output: {
		publicPath: '/',
		sourcePrefix: '  ',

		path: path.resolve(__dirname, SCRIPTS_ROOT),
		filename: PRODUCTION ? '[name].js' : '[name].js?[hash]',
	},

	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug: !PRODUCTION,
		}),

		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		}),
		new webpack.DefinePlugin({
			'__APP_CONFIG__': JSON.stringify(_.merge({}, require('./grip/config/base'), require(`./grip/config/${env}`))),
			'process.env.NODE_ENV': `"${env}"`,
			'process.env.BROWSER': true,
			'__DEV__': !PRODUCTION,
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: ({ resource }) => /node_modules|\/lib\//.test(resource),
		}),
		new webpack.optimize.CommonsChunkPlugin('manifest'),
		...(PRODUCTION ? [
			new webpack.optimize.OccurrenceOrderPlugin(),
			new webpack.optimize.AggressiveMergingPlugin(),
		] : []),
	],

	cache: !PRODUCTION,

	watchOptions: {
		aggregateTimeout: 400,
		ignored: /node_modules/,
	},

	stats: {
		colors: true,
		reasons: !PRODUCTION,
		hash: VERBOSE,
		version: VERBOSE,
		timings: true,
		chunks: VERBOSE,
		chunkModules: VERBOSE,
		cached: VERBOSE,
		cachedAssets: VERBOSE,
	},


	resolve: {
		modules   : [path.resolve(__dirname, 'grip/scripts'), 'node_modules'],
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
		alias: {
			'react': 'react-lite',
			'react-dom': 'react-lite',
		},
	},

	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader',
			}, {
				test: /\.json$/,
				loader: 'json-loader',
			}, {
				test: /\.txt$/,
				loader: 'raw',
			}, {
				test: /\.(png|jpg|jpeg|gif)$/,
				loader: 'url-loader?limit=10000',
			}, {
				test: /\.(wav|mp3|ogg)$/,
				loader: 'url-loader?name=sounds/[name].[ext]',
			}, {
				test: /\.(eot|ttf|svg|woff|woff2)$/,
				loader: 'file-loader?name=../styles/fonts/[name].[ext]',
			},
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader'
			},
		],
	},

  devtool: "cheap-module-source-map"
};
