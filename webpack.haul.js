import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import NormalModuleReplacementPlugin from 'webpack/lib/NormalModuleReplacementPlugin';

module.exports = ({ platform }, defaults) => {
  const bundleTest = /\.(js|(js)?bundle)($|\?)/i;
  const uglifyPlugin =  new UglifyJsPlugin({test: bundleTest, sourceMap: true});

  const replaceReactNativeImplementation = new NormalModuleReplacementPlugin(
    new RegExp(require.resolve('react-native/Libraries/react-native/react-native-implementation')),
    require.resolve('./src/vendor/react-native/Libraries/react-native/react-native-implementation.js'),
  );

  return {
    ...defaults,
    entry: `./index.js`,
    plugins: [
      ...defaults.plugins,
      uglifyPlugin,
      replaceReactNativeImplementation,
    ],
  }
};
