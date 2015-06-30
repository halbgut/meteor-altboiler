/* boilerUtils
 * This object holds functions that assist Boilerplate
 */

var boilerUtils = {}

boilerUtils.renderAction = function renderAction (action) {
  if(typeof action === 'function') return action()
  if(typeof action === 'string') {
    if(action.substr(-5) === '.html') return altboiler.getTemplate(action)
    return action
  }
},

boilerUtils.getBoilerTemplateData = function getTemplateData (includes, appScript, content, onLoadHooks, hookedCss, hookedJs) {
  return {
    script: [Assets.getText('assets/loader.js')].concat(hookedJs).join('\n'),
    styles: hookedCss.join('\n'),
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