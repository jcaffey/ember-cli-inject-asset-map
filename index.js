/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-inject-asset-map',

  // Add asset map hash to asset-map controller
  postBuild: function (results) {
    this._super.apply(this, arguments);

    if (process.env.EMBER_ENV === 'development') {
      console.log('Not processing asset map in development'.rainbow);
      return;
    }

    console.log('\nInjecting asset map hash...'.rainbow);

    let fs           = require('fs'),
        path         = require('path'),
        colors       = require('colors'),
        appName      = this.project.config(process.env.EMBER_ENV).modulePrefix,
        assetMap     = {},
        assetsPath   = path.join(results.directory, 'assets'),
        assetMapPath = path.join(assetsPath, 'assetMap.json'),
        assetMapKey  = 'assetMapHash',
        expression   = new RegExp(assetMapKey + ':\\s?(void 0|undefined)');

    // find assetMap
    if (fs.existsSync(assetMapPath)) {
      let map = JSON.parse(fs.readFileSync(assetMapPath, 'utf-8'));
      assetMap = map.assets;
    } else {
      console.log("File 'assets/assetMap.json' does not exist.");
    }

    // inject assetMap to file
    let injectFile = (jsPath) => {
      success = true
      if (fs.existsSync(jsPath)) {
        let js = fs.readFileSync(jsPath, 'utf-8');
        let injectedJs  = js.replace(expression, assetMapKey + ': ' + JSON.stringify(assetMap));
        fs.writeFileSync(jsPath, injectedJs, 'utf-8');
      } else {
        success = false;
        console.error(`Unable to inject asset map. File "${jsPath}" does not exist.`);
      }
      return success;
    }

    // inject to app js
    let appjsReg   = new RegExp(`${appName}-([a-z0-9])+.js`),
        files      = fs.readdirSync(assetsPath),
        success    = false;
    files.map(file => {
      if (appjsReg.test(file)) {
        success = injectFile(path.join(assetsPath, file));
      }
    })

    // inject to engines js
    let enginesPath = path.join(results.directory, 'engines-dist');
    if (fs.existsSync(enginesPath)) {
      let enginejsReg = new RegExp('engine-([a-z0-9])+.js'),
          engines     = fs.readdirSync(enginesPath);
      engines.map(engine => {
        let enginePath  = path.join(enginesPath, engine, 'assets'),
            engineFiles = fs.readdirSync(enginePath);
        engineFiles.map(file => {
          if (enginejsReg.test(file)) {
            injectFile(path.join(enginePath, file));
          }
        })
      })
    }

    if (success) {
      console.log('Done! Asset paths are available in all components, controllers, and routes via assetMap.assetMapHash.'.rainbow);
    }
  }
};

