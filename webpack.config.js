const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const vConsoleWebpackPlugin = require('vconsole-webpack-plugin')
const autoprefixer = require('autoprefixer')

const NODE_ENV = process.env.NODE_ENV || 'development' // 构建环境
const PROJECT_ENV = process.env.PROJECT_ENV || 'prod' // 项目配置环境

const isDev = NODE_ENV === 'development'

const entry = {}
const extraPlugins = []
glob
  .sync(path.resolve(__dirname, './src/pages/*/index.js'))
  .forEach(entryFile => {
    let pageName = path
      .dirname(entryFile)
      .split('/')
      .pop()
    entry[pageName] = [entryFile]
    let htmlOptions = {
      filename: path.resolve(__dirname, `./dist/${pageName}.html`),
      template: path.resolve(__dirname, `./src/pages/${pageName}/index.html`),
      chunks: ['common', pageName]
    }
    extraPlugins.push(new HtmlWebpackPlugin(htmlOptions))
	})
	
const output = {
	path: path.resolve(__dirname, './dist'),
	publicPath: isDev ? '' : '/static/',
	filename: `static/js/[name]${isDev ? '' : '.[chunkhash:8]'}.js`,
	chunkFilename: `static/js/[name]${isDev ? '' : '.[chunkhash:8]'}.chunk.js`
}

const devtool = '#source-map'

const resolve = {
  extensions: ['.jsx', '.js', '.json', '.less', '.css'],
  modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  alias: {
    '@components': path.resolve(__dirname, 'src/components'),
    '@services': path.resolve(__dirname, 'src/services'),
    '@assets': path.resolve(__dirname, 'src/assets')
  }
}

const optimization = {
  splitChunks: {
    name: 'common',
    chunks: 'initial'
  }
}

const modules = {
	rules: [
		{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: { loader: 'babel-loader' }
		},
		{
			test: /\.(css|less)$/,
			exclude: /node_modules/,
			use: [
				isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
				{
					loader: 'css-loader',
					options: isDev ? { sourceMap: true, minimize: true } : { minimize: true }
				},
				{
					loader: `postcss-loader`,
					options: {
						sourceMap: isDev,
						ident: 'postcss',
						plugins: () => [
							autoprefixer({
								browsers: [ "iOS >= 8", "Android >= 4"]
							})
						]
					}
				},
				{
					loader: 'less-loader',
					options: { sourceMap: isDev }
				}
			]
		},
		{
			test: /\.css$/,
			include: /node_modules/,
			use: ['style-loader', 'css-loader']
		},
		{
			test: /\.html$/,
			use: [{ loader: 'html-loader', options: { minimize: true } }]
		},
		{
			test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif|svga)(\?.*)?$/i,
			use: [
				{
					loader: 'url-loader',
					options: {
						limit: 5000,
						name: `static/media/[name]${isDev ? '' : '.[hash:8]'}.[ext]`
					}
				}
			]
		},
		{
			test: /\.(xml|txt|md)$/,
			use: 'raw-loader'
		}
	]
}

const plugins = [
  new CleanWebpackPlugin(['dist'], { root: __dirname }),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    'process.env.PROJECT_ENV': JSON.stringify(PROJECT_ENV)
  }),
  new MiniCssExtractPlugin({
    filename: isDev ? `static/css/[name].css` : `static/css/[name].[hash].css`,
    chunkFilename: isDev
      ? `static/css/common.css`
      : `static/css/common.[hash].css`
  }),
  // new vConsoleWebpackPlugin({ enable: isDev }),
  new vConsoleWebpackPlugin({ enable: false }),
  // new webpack.HotModuleReplacementPlugin(),
  ...extraPlugins
]

const devServer = {
	inline: true,
	hot: true,
	port: '8080',
	host: '0.0.0.0',
	contentBase: path.resolve(__dirname, 'dist'),
	compress: false,
	overlay: false,
	stats: 'minimal',
	watchOptions: {
		ignored: [
			path.resolve(__dirname, 'dist'),
			path.resolve(__dirname, 'node_modules')
		]
	}
}

module.exports = {
  mode: NODE_ENV,
  entry,
	output,
	devtool,
  resolve,
  module: modules,
  optimization,
  plugins,
  devServer,
}
