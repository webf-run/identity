const path = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');


const SITE_DIST = path.join(__dirname, './dist');

module.exports = (env, argv) => {

  const config = {
    context: __dirname,
    target: 'node',

    entry: './src/main.ts',

    externalsPresets: { node: true },
    externals: [nodeExternals({
      allowlist: [
        'crypto-random-string',
        '@sindresorhus/slugify',
        '@sindresorhus/transliterate'
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

    plugins: [],

    resolve: {
      extensions: ['.ts', '.js', '.mjs', '.cjs'],
      mainFields: ['module', 'main'],
      alias: {}
    }
  };

  if (env.production) {
    config.mode = 'production';
    config.devtool = 'source-map';
  } else {
    config.mode = 'development';
    config.devtool = 'eval-source-map';
    config.plugins.push(new NodemonPlugin());
  }

  return config;
};
