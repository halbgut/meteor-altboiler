fs = Npm.require('fs')

altboiler = function altboiler (options) {
  options = options || {}
  altboiler.config = _.extend(options, altboiler.defaults)
  altboiler.renderAction()
}

_.extend(altboiler, altboilerUtils)
_.extend(altboiler, {
  config: false,
  defaults: {
    onLoad: function fadeOut () {
      document.getElementById('boilerPlateLoader').style.opacity = 0
    },
    action: 'default'
  },

  renderedAction: false,

  // Renders a template and returns HTML
  // You can bind a context to it to use it as a context for the template
  getTemplate: function getTemplate (templateName) {
    var rawTemplate = altboiler.getRawTemplate(templateName)
    if(!rawTemplate) return templateName
    SSR.compileTemplate(templateName, rawTemplate)
    return SSR.render(templateName, this)
  },

  route: function route (path, name) {},

  renderAction: function renderAction () {
    var action = altboiler.config.action
    altboiler.renderedAction = {
      'string': altboiler.getTemplate,
      'function': action
    }[typeof action](action)
    return altboiler.renderedAction
  },

  getTemplateData: function getTemplateData (manifest, content, config) {
    var data = {
      script: Assets.getText('assets/loader.js'),
      styles: Assets.getText('assets/styles.css'),
      content: content,
      includes: EJSON.stringify(altboiler.getIncludes(manifest)),
      meteorRuntimeConfig: EJSON.stringify(__meteor_runtime_config__ || {})
    }
    return data
  }
})
