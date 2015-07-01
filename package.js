Package.describe({
  name: 'kriegslustig:altboiler',
  version: '0.1.0',
  summary: ' A non render-blocking alternative to the Meteor-core boilerplate-generator package',
  git: 'https://github.com/Kriegslustig/meteor-altboiler',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2')
  api.use(['underscore', 'webapp', 'meteorhacks:ssr@2.1.2'])
  api.addFiles(
    [
      'assets/main.html',
      'assets/default.html',
      'assets/loader.js',
      'assets/styles.css'
    ],
    'server',
    {isAsset: true}
  )
  api.addFiles(
    [
      'lib/statics.js',
      'lib/maniUtils.js',
      'lib/boilerUtils.js',
      'altboiler.js'
    ],
    'server'
  )
  api.export(['altboiler', '_Altboiler', '_altboilerScope'], 'server')
});

Package.onTest(function(api) {
  api.use(['tinytest', 'underscore', 'kriegslustig:altboiler'])
  api.addFiles(
    ['tests/assets/testTemplate.html'],
    'server',
    {isAsset: true}
  )
  api.addFiles(
    /* To test that scripts */
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
