/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-inject-asset-map',

  // Add asset map hash to asset-map controller
  postBuild: function (results) {
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

    // Write to temp and dist
    fs.writeFileSync(jsPath, injectedJs, 'utf-8');
    fs.writeFileSync(path.join('./dist', assetMap['assets/art19.js']), injectedJs, 'utf-8');

    console.log('Done! Asset paths are available in all components, controllers, and routes via assetMap.assetMapHash.'.rainbow);
  }
};

