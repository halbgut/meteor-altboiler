
// Get some stuff closer
var maniUtils = altboilerScope._maniUtils
var templUtils = altboilerScope._templUtils
var boilerUtils = altboilerScope._boilerUtils

var allIncludes = maniUtils.getIncludes(MANIFESTS[CURRENT_ARCH].manifest)

/*
 * This listenes for all routes,
 * but doesn't conflict with any resources
 */
WebApp.connectHandlers.use(function (req, res, next) {
  res.end(altboiler.Boilerplate())
})

WebApp.rawConnectHandlers.use(APP_SCRIPT, function (req, res, next) {
  res.end(maniUtils.getScripts(allIncludes['js']))
})

altboiler = function altboiler (options) {
  altboiler.config = _.extend(options, altboiler.config)
}

altboiler.config = {
  onLoad: [function fadeOut (next) {
    document.getElementById('altboiler_boilerPlateLoader').style.opacity = 0
    setTimeout(next, 200)
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
altboiler.Boilerplate = function Boilerplate () {
  return altboiler.getTemplate.call(
    boilerUtils.getBoilerTemplateData(
      allIncludes,
      APP_SCRIPT,
      (boilerUtils.renderAction(altboiler.config.action)),
      altboiler.config.onLoad
    ),
    'main'
  )
}
