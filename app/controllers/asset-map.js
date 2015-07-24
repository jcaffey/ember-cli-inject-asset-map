import Ember from 'ember';

/**
  AssetMapController
  This will be injected into all your components, controllers, and routes.

  @module ember-cli-inject-asset-map
  @class AssetMapController
  @extends Ember.Controller
*/
export default Ember.Controller.extend({
  /**
    @attribute assetMapHash
    @type {Object}
  */
  assetMapHash: undefined,

  /**
    @method pathForAsset
    @type {String|undefined}
  */
  pathForAsset: function (key) {
    var key   = key.replace(/^\//, '');
    var asset = this.get('assetMapHash')[key];

    if (asset) {
      return '/'.concat(asset);
    } else {
      return undefined;
    }
  }
});


