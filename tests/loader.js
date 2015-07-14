function newAltboilerWithLoader () {
  var newAltboiler = new _Altboiler
  newAltboiler.loader = _.clone(altboiler.loader)
  return newAltboiler
}

Tinytest.add('altboiler.loader', function (test) {
  test.equal(typeof altboiler.loader, 'object', 'The global altboiler should have a property loader which should be an object')
})

Tinytest.add('loader.onLoad', function (test) {
  var altboiler = newAltboilerWithLoader()
  test.equal(typeof altboiler.loader.onLoad, 'function', 'It should be a function')
  test.equal(typeof altboiler.loader.onLoad(function () {}), 'number', 'It should return a number')
  test.equal(altboiler.loader.onLoadQueue[altboiler.loader.onLoad(function(){return 'hi'})](), 'hi', 'It should push the function to loader.onLoadQueue')
  test.equal(typeof altboiler.loader.onLoadQueue[altboiler.loader.onLoad('loader')].onLoad, 'function', 'It should be able to take function names as arguments and then push the function with that name inside its context')
  altboiler.loader.onLoad([function () {}, function () { return true }])
  test.isTrue(altboiler.loader.onLoadQueue[altboiler.loader.onLoadQueue.length - 1](), 'It should be able to take an array as an argument')
})

Tinytest.add('loader.runOnLoadQueue', function (test) {
  var altboiler = newAltboilerWithLoader()
  var testVar = ''
  altboiler.loader.onLoadQueue = [
    function (next) { testVar += 'test1'; next() },
    function (next) { testVar += 'test2'; next() },
    function (next) { testVar += 'test3'; next() }
  ]
  altboiler.loader.runOnLoadQueue()
  test.equal(testVar, 'test1test2test3', 'It should synchronously run all functions in reverse inside loader.onLoadQueue')
})

Tinytest.add('loader.headAppender', function (test) {
  var altboiler = newAltboilerWithLoader()
  test.equal(typeof altboiler.loader.headAppender, 'function', 'It should be a function')
  test.equal(typeof altboiler.loader.headAppender('head'), 'function', 'It should return a function')
  // Sadly the dom part is hard to test and the functionality is trivial, so I'm leaving it at this
})

Tinytest.add('loader.removerById', function (test) {
  var altboiler = newAltboilerWithLoader()
  test.equal(typeof altboiler.loader.removerById, 'function', 'It should be a function')
  test.equal(typeof altboiler.loader.removerById('someId'), 'function', 'It should return a function')
  // Sadly the dom part is hard to test and the functionality is trivial, so I'm leaving it at this
})
