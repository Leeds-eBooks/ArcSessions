const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'js'),
  },
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: 'js-yaml-loader',
      },
      {
        test: /\.min\.js$/,
        use: 'script-loader',
      },
    ],
  },
}
