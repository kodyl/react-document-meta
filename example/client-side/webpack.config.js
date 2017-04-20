var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:9001',
    'webpack/hot/only-dev-server',
    './example/client-side/index.js'
  ],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [{
      test: /\.js$/,
      use: [
        { loader: 'react-hot-loader' },
        { loader: 'babel-loader?cacheDirectory=true' }
      ],
      exclude: /node_modules/
    }]
  }
};
