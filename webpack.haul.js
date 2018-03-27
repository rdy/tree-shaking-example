import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

module.exports = ({ platform }, defaults) => {
  const bundleTest = /\.(js|(js)?bundle)($|\?)/i;
  const uglifyPlugin =  new UglifyJsPlugin({test: bundleTest, sourceMap: true});

  return {
    entry: `./index.js`,
    optimization: {
      ...defaults.optimization,
      namedModules: false,
    },
    plugins: [
      ...defaults.plugins,
      uglifyPlugin,
    ],
    resolve: {
      ...defaults.resolve,
      alias: {
        ...defaults.resolve.alias,
        'react-native$': './src/modules/react-native/Libraries/react-native/react-native-implementation.js'
      }
    }
  }
};
