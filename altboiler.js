
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

altboiler.config = false

altboiler.defaults = {
  onLoad: [function fadeOut (next) {
    document.getElementById('boilerPlateLoader').style.opacity = 0
    next()
  }],
  action: 'default'
}

/* altboiler.onLoad(func)
 * `func` - a function
 * returns the index of the newly added hook
 * The passed function is pushed to `config.onLoad`
 * That function is passed to the client using `.toString`
 * And then executed in a different context.
 * This means, that the function can't have any dependencies
 * (except for ones defined inside the script you pass to the client)
 */
altboiler.onLoad = function onLoad (func) {
  altboiler.config.onLoad.push(func)
  return altboiler.config.onLoad.length - 1
}


// Renders a template and returns HTML
// You can bind a context to it to use it as a context for the template
altboiler.getTemplate = function getTemplate (templateName) {
  var rawTemplate = templUtils.getRawTemplate(templateName)
  if(!rawTemplate) return templateName
  SSR.compileTemplate(templateName, rawTemplate)
  return SSR.render(templateName, this)
}

// Returns the generated boilerplate
altboiler.Boilerplate = function Boilerplate (manifests) {
  return altboiler.getTemplate.call(
    boilerUtils.getBoilerTemplateData(
      maniUtils.getIncludes(manifests[currentArch].manifest),
      (boilerUtils.renderAction(altboiler.config.action)),
      altboiler.config,
      altboiler.config.onLoad
    ),
    'main'
  )
}
