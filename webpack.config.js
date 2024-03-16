var path = require('path');
var webpack = require('webpack');

const PACKAGE_JSON = require('./package.json');
const VERSION = `v${PACKAGE_JSON.version}`;
const { NODE_ENV, PICPIC_EXPLORER_MODE } = process.env;

const devtool = NODE_ENV === 'production' ? '#source-map' : '#eval-source-map';
const publicPath = NODE_ENV === 'production' && PICPIC_EXPLORER_MODE === 'demo' ? '/' : '/dist/';

let API_ROOT = '';
if (PICPIC_EXPLORER_MODE === 'demo') {
  API_ROOT = '\'/static/api\'';
} else if (NODE_ENV === 'production') {
  API_ROOT = '\'http://picpic-api.argonn.me\'';
} else {
  API_ROOT = '\'http://localhost:27112\'';
}

const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: `"${NODE_ENV}"`,
  },
  VERSION: JSON.stringify(VERSION),
  EXPLORER_MODE: `"${PICPIC_EXPLORER_MODE || 'default'}"`,
  API_ROOT,
});

let plugins = [definePlugin];
if (NODE_ENV === 'production') {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath,
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ],
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader?indentedSyntax'
        ],
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ],
            'sass': [
              'vue-style-loader',
              'css-loader',
              'sass-loader?indentedSyntax'
            ]
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool,
  plugins
}
