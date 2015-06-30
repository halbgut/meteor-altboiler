Package.describe({
  name: 'kriegslustig:altboiler',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: ' A non render-blocking alternative to the Meteor-core boilerplate-generator package',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/Kriegslustig/meteor-altboiler',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
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
  api.export('altboiler', 'server')
});

Package.onTest(function(api) {
  api.use('tinytest')
  api.use('kriegslustig:altboiler')
  api.addFiles(
    [
      'tests/altboiler.js'
    ],
    'server'
  );
});
