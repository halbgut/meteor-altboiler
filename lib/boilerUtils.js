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

boilerUtils.getBoilerTemplateData = function getTemplateData (jsIncludes, content, head) {
  var data = {
    script: Assets.getText('assets/loader.js'),
    styles: Assets.getText('assets/styles.css'),
    content: content,
    includes: EJSON.stringify(jsIncludes),
    meteorRuntimeConfig: EJSON.stringify(__meteor_runtime_config__ || {})
  }
  return data
},

altboilerScope = altboilerScope || {}
altboilerScope._boilerUtils = boilerUtils