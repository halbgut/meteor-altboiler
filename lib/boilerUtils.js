/* boilerUtils
 * This object holds functions that assist Boilerplate
 */

var boilerUtils = {}

boilerUtils.getBoilerTemplateData = function getTemplateData (includes, appScript, content, config) {
  return {
    /* The assets/loader script isn't hooked using the public object, to isure, it's not removed. */
    script: [boilerUtils.getLoader()].concat(config.js).join('\n'),
    styles: config.css.join('\n'),
    content: content,
    head: '"' + encodeURIComponent(includes['head'].join('\n')) + '"',
    body: '"' + encodeURIComponent(includes['body'].join('\n')) + '"',
    appScript: appScript,
    onLoadHooks: '[' + boilerUtils.parseOnLoadHooks(config.onLoad).join(',') + ']',
    // Not quite sure as to wether or not it's save
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