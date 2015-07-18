/* boilerUtils
 * This object holds functions that assist Boilerplate
 */

var boilerUtils = {}

/* boilerUtils.getBoilerTemplateData (includes, appScript, action, config)
 * `includes` - An includes object created by `maniUtils.getIncludes`
 * `appScript` - The relative URL to the appScript
 * `action` - Some HTML
 * `config` - A config object, structured like `altboiler.configuration`
 * This function parses all these options to make them readable by spacebars
 * It uses EJSON to encode objects (__meteor_runtime_config__)
 * It uses encodeURICompontent for the HTML used as strings inside assets/loader.js
 * __meteor_runtime_config__ is also passed
 */
boilerUtils.getBoilerTemplateData = function getTemplateData (includes, action, config) {
  return {
    /* The assets/loader script isn't hooked using the public object, to asure, it's not removed. */
    script: boilerUtils.stringifyFuncCaller([boilerUtils.getLoader()].concat(config.js || '')).join('\n'),
    css: '"' + encodeURIComponent([].concat(includes.css).join('\n')) + '"',
    styles: [].concat(config.css).join('\n'),
    content: config.content,
    action: action,
    head: includes.head.join('\n'),
    body: includes.body.join('\n'),
    appScript: config.appScript,
    onLoadHooks: '[' + boilerUtils.parseJsArr([].concat(config.onLoad || '')).join(',') + ']',
    meteorRuntimeConfig: EJSON.stringify(__meteor_runtime_config__ || {})
  }
},

/* boilerUtils.parseJsArr(hooksArr)
 * `hooksArr` - An array of functions or strings to parse
 * Maps through the array;
 * simply executing and returning `toString` of all elements inside the array
 */
boilerUtils.parseJsArr = function parseJsArr (hooksArr) {
  return _.invoke(hooksArr, 'toString')
}

/* boilerUtils.stringifyFuncCaller(jsArr)
 * `jsArr` - An array of functions or strings
 * This stringifies all functions and wraps them in a closure (`()()`)
 */
boilerUtils.stringifyFuncCaller = function stringifyFuncCaller (jsArr) {
  return jsArr.map(function (jsThing) {
    return typeof jsThing == 'function' ?
      ['(', ')()'].join(jsThing.toString()) : jsThing
  })
}

/* boilerUtils.getLoader()
 * returns the loader script
 * It uses `UglifyJSMinify` to minify the JS
 * It has a caching mechanism for that,
 * so it only gets minified once, at server startup
 */
boilerUtils.getLoader = (function makeGetLoader () {
  var cachedLoader = false
  return function getLoader () {
    if(cachedLoader) return cachedLoader
    return cachedLoader = UglifyJSMinify(
        Assets.getText('assets/loader.js'),
        {fromString: true}
    ).code
  }
})()

_altboilerScope = _altboilerScope || {}
_altboilerScope.boilerUtils = boilerUtils
