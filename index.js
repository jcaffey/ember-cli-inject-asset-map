/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-inject-asset-map',

  // Add asset map hash to asset-map controller
  postBuild: function (results) {
    if (process.env.EMBER_ENV === 'development') {
      console.log('Not processing asset map in development'.rainbow);
      return;
    }

    var fs          = require('fs'),
        path        = require('path'),
        colors      = require('colors'),
        tree        = results['graph']['tree'],
        assetMap    = tree._inputNodes[0].assetMap,
        jsPath      = path.join(results.directory, assetMap['assets/art19.js']), // TODO: allow specifying name of js file
        js          = fs.readFileSync(jsPath, 'utf-8'),
        assetMapKey = 'assetMapHash',
        expression  = new RegExp(assetMapKey + ':\\s?(void 0|undefined)'),
        injectedJs  = js.replace(expression, assetMapKey + ': ' + JSON.stringify(assetMap));

    console.log('\nInjecting asset map hash...'.rainbow);

    var success = true;
    if (fs.existsSync(jsPath)) {
      fs.writeFileSync(jsPath, injectedJs, 'utf-8');
    } else {
      success = false;
      console.log('Unable to inject asset map. File "' + jsPath + '" does not exist.');
    }

    if (success) {
      console.log('Done! Asset paths are available in all components, controllers, and routes via assetMap.assetMapHash.'.rainbow);
    }
  }
};

