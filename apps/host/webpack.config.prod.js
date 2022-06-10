const withModuleFederation = require('@nrwl/react/module-federation');
const moduleFederationConfig = require('./module-federation.config');

module.exports = withModuleFederation({
  ...moduleFederationConfig,
  /*
   * Remote overrides for production.
   * Each entry is a pair of an unique name and the URL where it is deployed.
   *
   * e.g.
   * remotes: [
   *   ['app1', '//app1.example.com'],
   *   ['app2', '//app2.example.com'],
   * ]
   *
   * You can also use a full path to the remoteEntry.js file if desired.
   *
   * remotes: [
   *   ['app1', '//example.com/path/to/app1/remoteEntry.js'],
   *   ['app2', '//example.com/path/to/app2/remoteEntry.js'],
   * ]
   */
  remotes: [
    // ['shop', '//localhost:4201/'],
    // ['payment', '//localhost:4202/'],
    // ['about', '//localhost:4203/'],
    // ['search', '//localhost:4204/'],

    ['shop', 'http://localhost:3000/shop'],
    ['payment', 'http://localhost:3000/payment'],
    ['about', 'http://localhost:3000/about'],
    // ['search', 'http://localhost:3000/search'],
  ],
});
