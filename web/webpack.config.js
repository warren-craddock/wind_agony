// Most of the stuff in this file has been copied or adapted from this howto:
// https://github.com/petehunt/webpack-howto
var path = require('path');

const WIND_AGONY_ROOT = '.';

module.exports = {
  // Read a single top-level file for each page. This top-level file then
  // includes all of the assets used for that page on the front-end: JavaScript,
  // CSS, and HTML.
  //
  // See comments about having multiple entry points
  // https://webpack.github.io/docs/multiple-entry-points.html
  entry: {
    main: path.resolve(WIND_AGONY_ROOT, 'web/client/main.jsx'),
    test: path.resolve(WIND_AGONY_ROOT, 'web/client/test_main.js'),
  },

  devtool: '#inline-source-map',

  // Emit a single file, bundle.js, that is ready to send to the front-end.
  output: {
    filename: '[name]-bundle.js',
    path: path.resolve(WIND_AGONY_ROOT, 'web/static/js')
  },

  // Imports and requires in JavaScript will search the web root directory.
  // See http://stackoverflow.com/questions/27502608/resolving-require-paths-with-webpack
  resolve: {
    modules: [WIND_AGONY_ROOT, 'node_modules'],
    extensions: ['.js', '.jsx', '.css']
  },

  module: {
    loaders: [
      {
        // Look for any files that end with .js or .jsx.
        test: /\.(js|jsx)$/,

        // Don't transpile stuff in the node_modules dir? I don't fully
        // understand, but got the magic incantation here:
        // https://github.com/gaearon/react-hot-loader/issues/133
        // Without this, the variable |global| is undefined, and OnsenUI won't
        // work in the browser.
        exclude: /node_modules/,

        // Run the .js files through Babel, configured to understand React code
        // and emit ECMAScript 2015, which all browsers understand.
        loader: 'babel-loader',
      },

      // Look for files that end in .css, and use the css-loader to load them.
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },

      // Look for files that end in .json, and use the json-loader to load them.
      {
        test: /\.json$/,
        loader: 'json-loader',
      },

      // Look for image and font files, and bundle them up as data URLs inside
      // the bundle. I found this magic incantation while trying to make
      // font-awesome load properly:
      // http://stackoverflow.com/questions/31493716/webpack-less-error-it-cant-resolve-ttf-and-woff2-files-from-uikit
      {
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?name=[name]-[hash].[ext]'
      },

      {
        // Look for files that end in *test.js, and give them to Mocha to be
        // run as tests.
        test: /test\.js$/,

        // Don't transpile stuff in the node_modules dir. Without this. Mocha
        // won't run in the browser.
        exclude: /node_modules/,

        // These loaders are chained; babel-loader runs first, to transform our
        // JavaScript ES6 code into ES2015. Then, mocha-loader pulls the tests
        // into its test suite.
        // See https://webpack.github.io/docs/loaders.html
        loader: 'mocha-loader!babel-loader',
      }
    ]
  }
};
