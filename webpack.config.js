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
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
      {
        test: /\.ya?ml$/,
        use: 'yml-loader',
      },
      {
        test: [/\.min\.js$/, /echo.js$/],
        use: 'script-loader',
      },
    ],
  },
  devtool: 'source-map',
}
