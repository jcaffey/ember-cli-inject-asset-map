export function initialize(container, app) {
  app.register('assets:asset-map', container.lookup('controller:asset-map'), { instantiate: false, singleton: true });

  app.inject('route', 'assetMap', 'assets:asset-map');
  app.inject('controller', 'assetMap', 'assets:asset-map');
  app.inject('component', 'assetMap', 'assets:asset-map');
}

export default {
  name: 'asset-map',
  initialize: initialize
};
