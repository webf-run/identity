const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');


const SITE_DIST = path.join(__dirname, './dist');

module.exports = {
  context: __dirname,
  target: 'node',

  mode: 'development',
  devtool: 'source-map',

  entry: './src/main.ts',

  externalsPresets: { node: true },
  externals: [nodeExternals({
    allowlist: [
      'crypto-random-string',
      '@sindresorhus/slugify'
    ]
  })],

  node: {
    __dirname: 'eval-only'
  },

  output: {
    path: SITE_DIST,
    filename: 'bundle.js'
  },

  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  plugins: [
    new NodemonPlugin()
  ],

  resolve: {
    extensions: ['.ts', '.js', '.mjs', '.cjs'],
    mainFields: ['module', 'main'],
    alias: {}
  }
};
