
const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');

const PRODUCTION = process.argv.includes('-p');
const VERBOSE = process.argv.includes('--verbose');

const SCRIPTS_ROOT = 'grip/scripts';
const env = PRODUCTION ? 'production' : 'development';

module.exports = {
	entry: {
		popup: 'src/popup.js',
		content: 'src/content.js',
		background: 'src/background.js',
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
			name: "commons",
			filename: "commons.js",
		}),
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
		extensions: ['.js', '.jsx', '.json'],
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
		],
	},

};
