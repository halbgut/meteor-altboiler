function newAltboiler () {
  return new _Altboiler(_altboilerScope.maniUtils, _altboilerScope.boilerUtils)
}

Tinytest.add('altboiler', function (test) {
  var altboiler = newAltboiler()
  test.equal(typeof altboiler.configure, 'function', 'altboiler should be a function')
  altboiler.configure({test:1})
  test.equal(altboiler.config.test, 1, 'altboiler should add the properties from the passed object to altboiler.config ')
  altboiler.configure({test2:1})
  altboiler.configure({test2:2})
  test.equal(altboiler.config.test, 1, 'altboiler shouldn\'t remove existing properties')
  test.equal(altboiler.config.test2, 2, 'altboiler should override the overlap with the passed properties')
})

Tinytest.add('altboiler.config', function (test) {
  var altboiler = newAltboiler()
  test.equal(typeof altboiler.config, 'object', 'altboiler.config should be an object')
  test.equal(altboiler.config.action, 'assets/default.html', 'altboiler.config should have "default.html" as its default action')
})

Tinytest.add('altboiler.onLoad', function (test) {
  var altboiler = newAltboiler()
  test.equal(typeof altboiler.onLoad, 'function', 'altboiler should have a property onLoad, which should be a function')
  test.equal(typeof altboiler.onLoad(function () {}), 'number', 'altboiler.onLoad should return a number')
  test.equal(altboiler.onLoadHooks.length, 2, 'altboiler.onLoad should push the passed function to altboiler.onLoadHooks')
  ; (function () {
    function addedHook () {
      return 42
    }
    test.equal(altboiler.onLoadHooks[altboiler.onLoad(addedHook)](), addedHook(),'altboiler.onLoad should return the index of the newly added hook')
  })()
})

Tinytest.add('altboiler.getTemplate', function (test) {
  var altboiler = newAltboiler()
  var testTemplate = 'tests/assets/testTemplate.html'
  test.throws(altboiler.getTemplate.bind(null, 'test.html', Assets)) // It should fail when the passed Asset doesn\'t exsist
  test.isTrue(!!altboiler.getTemplate.call({}, testTemplate, Assets), 'It should render registered assets')
  test.equal(
    altboiler.getTemplate.call(
      {test: [1, 2]},
      testTemplate,
      Assets
    ),
    '<div>12</div>',
    'It should render assets as spacebars templates'
  )
  test.equal(
    altboiler.getTemplate.call(
      {test: [1, 2]},
      '<div>{{ #each test }}{{ this }}{{ /each }}</div>',
      Assets
    ),
    '<div>12</div>',
    'It should treat the first arg as the template if it\'s not a filename'
  )
})

Tinytest.add('altboiler.css', function (test) {
  var altboiler = newAltboiler()
  test.equal(typeof altboiler.css, 'function', 'altboiler should have a property `css` which is a function')
  test.equal(typeof altboiler.css('div {display: block;}'), 'number', 'It should return the index of the newly inserted css')
  test.equal(altboiler.hookedCss[altboiler.css('div {display: block;}')], 'div {display: block;}', 'It should push the css to hookedCss')
})

Tinytest.add('altboiler.js', function (test) {
  var altboiler = newAltboiler()
  test.equal(typeof altboiler.js, 'function', 'altboiler should have a property `js` which is a function')
  test.equal(typeof altboiler.js('console.log("moaarr drama!")'), 'number', 'It should return the index of the newly inserted js')
  test.equal(altboiler.hookedJs[altboiler.js('console.log("moaarr drama!")')], 'console.log("moaarr drama!")', 'It should push the js to hookedJs')
})

Tinytest.add('altboiler.Boilerplate', function (test) {
  var altboiler = newAltboiler()
  function cleanLB (str) {
    while(str.indexOf('\n') > -1) str = str.replace('\n', '')
    return str
  }
  test.isTrue(altboiler.Boilerplate().indexOf('<body>') > -1, 'Its return value should contain a body element')
  test.isFalse(altboiler.Boilerplate().indexOf('<DOCTYPE') > -1, 'Its return value should\'nt contain a doctype')
  test.isTrue(altboiler.Boilerplate().indexOf('<head>') > -1, 'Its return value should contain a head element')
  ; (function () {
    var altboiler = newAltboiler()
    altboiler.config.action = '<script>console.log("damn trolls")</script>'
    test.matches(cleanLB(altboiler.Boilerplate()), /<body>.*"damn\strolls"/gm, 'The action should be rendered inside the body')
  })()
  test.isTrue(altboiler.Boilerplate().indexOf('src="/altboiler/main.js"') > -1, 'It should render a script tag that gets the /altboiler/main.js')
  altboiler.css('div {display: block;}')
  test.matches(cleanLB(altboiler.Boilerplate()), /<style\stype="text\/css">.*div\s{display:\sblock;}/gm, 'The hookedCss should be rendered')
  altboiler.js('console.log("moaarr drama!")')
  test.matches(cleanLB(altboiler.Boilerplate()), /<script.*console\.log\("moaarr\sdrama!"\)/gm, 'The hookedJs should be rendered')
})
