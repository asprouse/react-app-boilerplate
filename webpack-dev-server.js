/* eslint no-var: 0, no-console: 0, vars-on-top: 0 */

require('babel/register')({
  extensions: ['.js', '.jsx'],
  stage: 0
});

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./config/webpack.config')(true);
var serverConfig = require('./config/server');


var initialCompile = true;

var compiler = webpack(webpackConfig);

var devServer = new WebpackDevServer(compiler, {
  contentBase: serverConfig.devEndpoint,
  publicPath: webpackConfig.output.publicPath,
  hot: true,
  inline: true,
  historyApiFallback: true,
  quiet: false,
  noInfo: false,
  lazy: false,
  stats: {
    colors: true,
    hash: false,
    version: false,
    chunks: false,
    children: false
  }
});

devServer.listen(serverConfig.devPort, 'localhost', function listenCallback(err) {
  if (err) console.error(err);
  console.log('=> 🔥  Webpack development server is running at %s', serverConfig.devEndpoint);
});

compiler.plugin('done', function compileCallback() {
  if (initialCompile) {
    initialCompile = false;
    process.stdout.write('Webpack: Done!');
  }
});
