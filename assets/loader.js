// When this is used client side, altboiler wont be defined
var loader = {}

loader.load = function load (includes, onLoadQueue) {
  var urlPrefix = jsCssPrefix = (__meteor_runtime_config__ && __meteor_runtime_config__.ROOT_URL_PATH_PREFIX) || '';
  loader.onLoadQueue.concat(onLoadQueue)
  loader.includeRenderer(document.head, includes, urlPrefix)
}

loader.onLoadQueue = []

loader.onLoad = function onLoad (func) {
  if(typeof func == 'object') return func.forEach(loader.onLoad)
  if(typeof func == 'string') func = eval('return ' + func)
  if(func) loader.onLoadQueue.push(func)
}

loader.runOnLoadQueue = function runOnLoadQueue (queue) {
  queue = queue || loader.onLoadQueue
  queue.pop()(loader.runOnLoadQueue.bind(null, queue))
}

loader.appender = function appender (head, body) {
  return function appendBodyAndHead (next) {
    if(head) document.head.innerHTML += decodeURIComponent(head)
    if(body) document.body.innerHTML += decodeURIComponent(body)
    next()
  }
}

loader.includeRenderer = function includeRenderer (appendTo, includes, urlPrefix) {
  var allScripts = ''
  var nthScriptLoaded = -1

   loader.onLoad(function cleanUpAndAppend () {
    document.body.removeChild(document.getElementById('boilerPlateLoader'))
    appendTo.appendChild(loader.createScriptTag(allScripts))
  })

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
    loader.fetchScript(
      urlPrefix + include,
      loader.depChecker(loadedChecker(index - 1), loadScript)
    )
  })
  loader.depChecker(loadedChecker(includes.length - 1), loader.runOnLoadQueue)()
}

loader.createScriptTag = function createScriptTag (script) {
  var scriptElem = document.createElement('script')
  scriptElem.type = 'text/javascript'
  scriptElem.innerHTML = script
  return scriptElem
}

loader.fetchScript = function fetchScript (resource, callback) {
  var req = new XMLHttpRequest()
  req.open('GET', resource)
  req.addEventListener('load', loader.ajaxResponseHandler(callback))
  req.send()
}

loader.ajaxResponseHandler = function ajaxResponseHandler (callback) {
  return function () {
    if(this.responseText) callback(this.responseText)
  }
}

loader.depChecker = function depChecker (isTrue, callback) {
  var args = arguments
  return function (data) {
    if(isTrue()) return callback(data)
    setTimeout(loader.depChecker.apply(null, args).bind(null, data), 100)
  }
}

if (typeof window !== 'undefined') {
  window.altboiler = {}
} else {
  altboiler = altboiler || {}
}
altboiler.loader = loader