const excludeNodeModulesExcept = require('./../helpers/excludeNodeModulesExcept.js');

function transpileJavaScript(mode) {
  const exclude =
    mode === 'production'
      ? excludeNodeModulesExcept([
          // 'dicomweb-client',
          // https://github.com/react-dnd/react-dnd/blob/master/babel.config.js
          'react-dnd',
          // https://github.com/dcmjs-org/dcmjs/blob/master/.babelrc
          // https://github.com/react-dnd/react-dnd/issues/1342
          // 'dcmjs', // contains: loglevelnext
          // https://github.com/shellscape/loglevelnext#browser-support
          // 'loglevelnext',
          // https://github.com/dcmjs-org/dicom-microscopy-viewer/issues/35
          // 'dicom-microscopy-viewer',
          // https://github.com/openlayers/openlayers#supported-browsers
          // 'ol', --> Should be fine

          /**
           * TODO 使用了 class-static-block ios 16.4 以下不支持 需要 babel
           * @link https://caniuse.com/mdn-javascript_classes_static_initialization_blocks
           */
          '@cornerstonejs',
        ])
      : excludeNodeModulesExcept([]);

  return {
    // Include mjs, ts, tsx, js, and jsx files.
    test: /\.(mjs|ts|js)x?$/,
    // These are packages that are not transpiled to our lowest supported
    // JS version (currently ES5). Most of these leverage ES6+ features,
    // that we need to transpile to a different syntax.
    exclude: [/(codecs)/, /(dicomicc)/, exclude],
    loader: 'babel-loader',
    options: {
      // Find babel.config.js in monorepo root
      // https://babeljs.io/docs/en/options#rootmode
      rootMode: 'upward',
      envName: mode,
      cacheCompression: false,
      // Note: This was causing a lot of issues with yarn link of the cornerstone
      // only set this to true if you don't have a yarn link to external libs
      // otherwise expect the lib changes not to be reflected in the dev server
      // as it will be cached
      cacheDirectory: false,
    },
  };
}

module.exports = transpileJavaScript;
