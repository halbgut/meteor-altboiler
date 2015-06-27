// load gets called client side
function load (includes) {
  var urlPrefix = jsCssPrefix = (__meteor_runtime_config__ && __meteor_runtime_config__.ROOT_URL_PATH_PREFIX) || '';
  altboiler.loader.includeRenderer(document.head, includes, urlPrefix)
}

// When this is used client side, altboiler wont be defined
var altboiler = altboiler || {}

altboiler.loader = {
  includeRenderer: function includeRenderer (appendTo, includes, urlPrefix) {
    var self = altboiler.loader
    var allScripts = ''
    var nthScriptLoaded = -1

    function cleanUpAndAppend () {
      document.body.removeChild(document.getElementById('boilerPlateLoader'))
      appendTo.appendChild(self.createScriptTag(allScripts))
    }

    function loadScript (script) {
      allScripts += '\n' + script
    }

    function loadedChecker (waitFor) {
      return function () {
        if(waitFor != nthScriptLoaded) return false
        nthScriptLoaded++
        return true
      }
    }

    includes.forEach(function (include, index) {
      self.fetchScript(
        urlPrefix + include,
        self.depChecker(loadedChecker(index - 1), loadScript)
      )
    })
    self.depChecker(loadedChecker(includes.length - 1), cleanUpAndAppend)()
  },

  createScriptTag: function createScriptTag (script) {
    var scriptElem = document.createElement('script')
    scriptElem.type = 'text/javascript'
    scriptElem.innerHTML = script
    return scriptElem
  },

  fetchScript: function fetchScript (resource, callback) {
    var self = altboiler.loader
    var req = new XMLHttpRequest()
    req.open('GET', resource)
    req.addEventListener('load', self.ajaxResponseHandler(callback))
    req.send()
  },

  ajaxResponseHandler: function ajaxResponseHandler (callback) {
    return function () {
      if(this.responseText) callback(this.responseText)
    }
  },

  depChecker: function depChecker (isTrue, callback) {
    var self = altboiler.loader
    var args = arguments
    return function (data) {
      if(isTrue()) return callback(data)
      setTimeout(self.depChecker.apply(null, args).bind(null, data), 100)
    }
  }
}