/**
 * Entry point for development and production PWA builds.
 */
import 'regenerator-runtime/runtime';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import { history } from './utils/history';

/**
 * EXTENSIONS AND MODES
 * =================
 * pluginImports.js is dynamically generated from extension and mode
 * configuration at build time.
 *
 * pluginImports.js imports all of the modes and extensions and adds them
 * to the window for processing.
 */
import { extensions as defaultExtensions, modes as defaultModes } from './pluginImports';
import loadDynamicConfig from './loadDynamicConfig';
import loadVConsole from './loadVConsole';

loadDynamicConfig(window.config).then(config_json => {
  // Reset Dynamic config if defined
  if (config_json !== null) {
    window.config = config_json;
  }

  /**
   * Combine our appConfiguration with installed extensions and modes.
   * In the future appConfiguration may contain modes added at runtime.
   *  */
  const appProps = {
    config: window ? window.config : {},
    defaultExtensions,
    defaultModes,
  };

  /** Create App */
  const app = React.createElement(App, appProps, null);
  /** Render */
  ReactDOM.render(app, document.getElementById('root'));
});

loadVConsole(window.config)
  .then(instance => {
    window.debug = options => {
      new instance.constructor(options);
      instance.destroy();
      instance = null;
    };
  })
  .catch(error => {
    console.error(`调试工具加载错误 ${error.message}`);
  });
window.debug = options => loadVConsole({ debug: true, options });
export { history };
