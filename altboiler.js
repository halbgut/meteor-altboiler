
// Get some stuff closer
var maniUtils = altboilerScope._maniUtils
var templUtils = altboilerScope._templUtils
var boilerUtils = altboilerScope._boilerUtils

altboiler = function altboiler (options) {
  options = options || {}
  altboiler.config = _.extend(options, altboiler.defaults)
  WebApp.connectHandlers.use(function (req, res, next) {
    res.end(altboiler.Boilerplate(WebApp.clientPrograms))
  })
}

_.extend(altboiler, {
  config: false,
  defaults: {
    onLoad: function fadeOut () {
      document.getElementById('boilerPlateLoader').style.opacity = 0
    },
    action: 'default'
  },

  // Renders a template and returns HTML
  // You can bind a context to it to use it as a context for the template
  getTemplate: function getTemplate (templateName) {
    var rawTemplate = templUtils.getRawTemplate(templateName)
    if(!rawTemplate) return templateName
    SSR.compileTemplate(templateName, rawTemplate)
    return SSR.render(templateName, this)
  },

  // Returns the generated boilerplate
  Boilerplate: function (manifests) {
    return altboiler.getTemplate.call(
      boilerUtils.getBoilerTemplateData(
        maniUtils.getIncludes(manifests[currentArch].manifest),
        (boilerUtils.renderAction(altboiler.config.action)),
        altboiler.config
      ),
      'main'
    )
  },
})