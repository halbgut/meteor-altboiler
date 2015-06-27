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

boilerUtils.getBoilerTemplateData = function getTemplateData (includes, content, head) {
  return {
    script: Assets.getText('assets/loader.js'),
    styles: Assets.getText('assets/styles.css'),
    content: content,
    head: EJSON.stringify(includes['head'].join('\n')),
    body: EJSON.stringify(includes['head'].join('\n')),
    jsIncludes: EJSON.stringify(includes['js']),
    meteorRuntimeConfig: EJSON.stringify(__meteor_runtime_config__ || {})
  }
},

altboilerScope = altboilerScope || {}
altboilerScope._boilerUtils = boilerUtils