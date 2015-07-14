Package.describe({
  name: 'kriegslustig:altboiler',
  version: '0.6.0',
  summary: ' A non render-blocking alternative to the Meteor-core boilerplate-generator package',
  git: 'https://github.com/Kriegslustig/meteor-altboiler',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2')
  api.use([
    'underscore',
    'webapp',
    'minifiers',
    'spacebars-compiler'
  ])
  api.addFiles(
    [
      'assets/default.html',
      'assets/fader.js',
      'assets/styles.css',
      'assets/main.html',
      'assets/loader.js'
    ],
    'server',
    {isAsset: true}
  )
  api.addFiles(
    [
      'lib/statics.js',
      'lib/maniUtils.js',
      'lib/boilerUtils.js',
      'lib/configUtils.js',
      'altboiler.js'
    ],
    'server'
  )
  api.export(['altboiler', '_Altboiler', '_altboilerScope'], 'server')
});

Package.onTest(function(api) {
  api.use(['tinytest', 'underscore', 'kriegslustig:altboiler'])
  /* A test-template to test the `Assets` stuff */
  api.addFiles(
    ['tests/assets/testTemplate.html'],
    'server',
    {isAsset: true}
  )
  api.addFiles(
    /* To test that script's scope, I need to manually add it */
    ['assets/loader.js'],
    'server'
  )
  api.addFiles(
    [
      'tests/altboiler.js',
      'tests/loader.js'
    ],
    'server'
  );
  api.export('Altboiler')
});
