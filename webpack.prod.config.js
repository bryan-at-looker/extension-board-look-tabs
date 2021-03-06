const path = require("path")

const PATHS = {
  app: path.join(__dirname, 'src/index.tsx'),
}

module.exports = {
  entry: {
    app: PATHS.app,
  },
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: /src/,
        sideEffects: false
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
}
