
const path = require('path');
const webpack = require('webpack');

const DEBUG = !process.argv.includes('-p');
const VERBOSE = process.argv.includes('--verbose');

const SCRIPTS_ROOT = 'grip/scripts';

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
		filename: DEBUG ? '[name].js?[hash]' : '[name].js',
	},

	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug: DEBUG,
		}),

		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
			'process.env.BROWSER': true,
			__DEV__: DEBUG,
		}),
		// new HtmlWebpackPlugin({
		// 	template: path.join(__dirname, "grip", "popup.html"),
		// 	filename: "popup.html",
		// 	chunks: ["popup"]
		// }),
		new webpack.optimize.CommonsChunkPlugin({
			name: "commons",
			filename: "commons.js",
			// minChunks: 2,
			// (Modules must be shared between 3 entries)

			// chunks: ["background", "content", "popup"],
			// (Only use these entries)
		}),
		...(!DEBUG ? [
			// new webpack.optimize.WatchIgnorePlugin([
			// 	path.resolve(__dirname, './**/fonts/'),
			// ]),

			// new webpack.optimize.OccurenceOrderPlugin(),
			// new webpack.optimize.UglifyJsPlugin({
			// 	compress: {
			// 		screw_ie8: true,
			// 		warnings: VERBOSE,
			// 	},
			// }),
			new webpack.optimize.AggressiveMergingPlugin(),
		] : []),
	],

	cache: DEBUG,
	// debug: DEBUG,

	watchOptions: {
		aggregateTimeout: 400,
		poll: true,
	},

	stats: {
		colors: true,
		reasons: DEBUG,
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
	// externals: {
	// 	'react': 'React',
	// 	'react-dom': 'ReactDOM',
	// },

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
