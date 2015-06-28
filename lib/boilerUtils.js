/* boilerUtils
 * This object holds functions that assist Boilerplate
 */

var boilerUtils = {}

boilerUtils.renderAction = function renderAction (action) {
  return {
    'string': altboiler.getTemplate,
    'function': action
  }[typeof action](action)
},

boilerUtils.getBoilerTemplateData = function getTemplateData (includes, appScript, content, onLoadHooks) {
  return {
    script: Assets.getText('assets/loader.js'),
    styles: Assets.getText('assets/styles.css'),
    content: content,
    head: '"' + encodeURIComponent(includes['head'].join('\n')) + '"',
    body: '"' + encodeURIComponent(includes['body'].join('\n')) + '"',
    appScript: appScript,
    onLoadHooks: '[' + boilerUtils.parseOnLoadHooks(onLoadHooks).join(',') + ']',
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

altboilerScope = altboilerScope || {}
altboilerScope._boilerUtils = boilerUtils