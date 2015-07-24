/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-inject-asset-map',

  // Add asset map hash to asset-map controller
  postBuild: function (results) {
    console.log('Injecting asset map hash...');

    var fs       = require('fs'),
        path     = require('path'),
        assetMap = results['graph']['tree']['assetMap'],
        jsPath   = path.join(results.directory, assetMap['assets/art19.js']); // TODO: allow specifying name of js file

    // TODO: I'd love a cleaner way to do this, but I'm not sure sure how since this has to be done after build.
    var js          = fs.readFileSync(jsPath, 'utf-8'),
        assetMapKey = 'assetMapHash',
        hackedJs    = js.replace(new RegExp(assetMapKey + ': undefined'), assetMapKey + ': ' + JSON.stringify(assetMap)),
        hackedCompressed = js.replace(new RegExp(assetMapKey + ':void 0'), assetMapKey + ':' + JSON.stringify(assetMap));

    // Inject in temp
    fs.writeFileSync(jsPath, hackedJs, 'utf-8');

    // Inject in dist (this assumes dist is using JS compression.)
    fs.writeFileSync(path.join('./dist', assetMap['assets/art19.js']), hackedCompressed, 'utf-8');

    console.log('Done! Asset paths are available in all components, controllers, and routes via assetMap.assetMapHash.');
  }
};

