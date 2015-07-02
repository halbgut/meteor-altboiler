/* boilerUtils
 * This object holds functions that assist Boilerplate
 */

var boilerUtils = {}

/* boilerUtils.getBoilerTemplateData (includes, appScript, content, config)
 * `includes` - An includes object created by `maniUtils.getIncludes`
 * `appScript` - The relative URL to the appScript
 * `content` - Some HTML
 * `config` - A config object, structured like `altboiler.configuration`
 * This function parses all these options to make them readable by spacebars
 * It uses EJSON to encode objects (__meteor_runtime_config__)
 * It uses encodeURICompontent for the HTML used as strings inside assets/loader.js
 * __meteor_runtime_config__ is also passed
 */
boilerUtils.getBoilerTemplateData = function getTemplateData (includes, appScript, content, config) {
  return {
    /* The assets/loader script isn't hooked using the public object, to isure, it's not removed. */
    script: [boilerUtils.getLoader()].concat(config.js).join('\n'),
    styles: [].concat(config.css).join('\n'),
    content: content,
    head: '"' + encodeURIComponent(includes['head'].join('\n')) + '"',
    body: '"' + encodeURIComponent(includes['body'].join('\n')) + '"',
    appScript: appScript,
    onLoadHooks: '[' + boilerUtils.parseOnLoadHooks([].concat(config.onLoad)).join(',') + ']',
    meteorRuntimeConfig: EJSON.stringify(__meteor_runtime_config__ || {})
  }
},

/* boilerUtils.parseOnLoadHooks(hooksArr)
 * `hooksArr` - An array of hooks to parse
 * Maps through the array;
 * simply executing and returning `toString`
 */
boilerUtils.parseOnLoadHooks = function parseOnLoadHooks (hooksArr) {
  return _.invoke(hooksArr, 'toString')
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
