if(Meteor.isClient) return

function newAltboiler () {
  var newAltboiler = Object.create(Altboiler)
  newAltboiler.configuration = {
    routes: {
      main: '/altboiler/main.js',
      css: '/altboiler/styles.css',
    },
    showLoader: true
  }
  return newAltboiler
}

function cleanLB (str) {
  while(str.indexOf('\n') > -1) str = str.replace('\n', '')
  return str
}

function newReqStump () {
  var end = ''
  return {
    0: {
      originalUrl: ''
    },
    1: {
      end: function (str) {
        end = str
      }
    },
    2: function () {/* Stumpy stump */},
    getEnd: function () {
      return end
    }
  }
}

Tinytest.add('altboiler.config', function (test) {
  var altboiler = newAltboiler()
  test.equal(typeof altboiler.config, 'function', 'It should be a function')
  test.isTrue(!!newAltboiler().config({}), 'It should be able to handle objects')
  altboiler.config({
    css: ['div {}'],
    js: ['console.log("moaarr drama!")'],
    onLoad: ['console.log("loadeed!")'],
    action: function () { return 'someAction...' },
  })
  test.matches(cleanLB(altboiler.Boilerplate()), /<style\stype="text\/css">.*div\s{}/gm, 'The hooked css should be rendered')
  test.matches(cleanLB(altboiler.Boilerplate()), /<script.*console\.log\("moaarr\sdrama!"\)/gm, 'The hooked js should be rendered')
  test.matches(cleanLB(altboiler.Boilerplate()), /<script.*console\.log\("loadeed!"\)/gm, 'The hooked js should be rendered')
  ; (function () {
    var altboiler = newAltboiler()
    altboiler.config({
      action: '<script>console.log("damn trolls")</script>'
    })
    test.matches(cleanLB(altboiler.Boilerplate()), /<body>.*"damn\strolls"/gm, 'The action should be rendered inside the body')
  })()
  altboiler = newAltboiler()
  altboiler.config({ js: function someFunc () {} })
  test.isTrue(cleanLB(altboiler.Boilerplate()).indexOf('(function someFunc() {})()') > -1, 'If I pass a function as configuration.js it should be called when it\'s loaded')
  altboiler = newAltboiler()
  altboiler.config({ content: '<main></main>' })
  test.isTrue(cleanLB(altboiler.Boilerplate()).indexOf('<main></main>'), 'the content option should be rendered')
})

Tinytest.add('altboiler.Boilerplate', function (test) {
  var altboiler = newAltboiler()
  test.isTrue(altboiler.Boilerplate().indexOf('<body>') > -1, 'Its return value should contain a body element')
  test.isFalse(altboiler.Boilerplate().indexOf('<DOCTYPE') > -1, 'Its return value should\'nt contain a doctype')
  test.isTrue(altboiler.Boilerplate().indexOf('<head>') > -1, 'Its return value should contain a head element')
  test.isTrue(altboiler.Boilerplate().indexOf('src="/altboiler/main.js"') > -1, 'It should render a script tag that gets the /altboiler/main.js')
})

Tinytest.add('altboiler.set', function (test) {
  var altboiler = newAltboiler()
  test.equal(typeof altboiler.set, 'function', 'It should be a function')
  test.isTrue(altboiler.set({test:true}).test, 'It should return the object that is passed to it.')
  altboiler.set({css: '.titanic {float: none}'})
  var reqStump = newReqStump()
  altboiler.serveBoilerplate(reqStump[0], reqStump[1], reqStump[2])
  test.isTrue(/\.titanic/g.test(reqStump.getEnd()), 'altboiler.Boilerplate should use the passed options')
  reqStump = newReqStump()
  altboiler.serveBoilerplate(reqStump[0], reqStump[1])
  test.isFalse(/\.titanic/g.test(reqStump.getEnd()), 'altboiler.Boilerplate should only use the passed options once')
  var func1 = function () {console.log('unique1')}
  var func2 = function () {console.log('unique2')}
  altboiler.config({onLoad: [func1]})
  altboiler.set({onLoad: func2})
  var reqStump2 = newReqStump()
  altboiler.serveBoilerplate(reqStump2[0], reqStump2[1])
  test.isTrue(reqStump2.getEnd().indexOf(func1.toString()), 'An option which is an array shouldn\'t be overriden by config')
  test.isTrue(reqStump2.getEnd().indexOf(func2.toString()), 'An option which is an array set using set should be merged with the configuration')
})
