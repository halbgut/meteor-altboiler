/*
 * This make my utils nicer to use
 */
var maniUtils = altboilerScope._maniUtils
var templUtils = altboilerScope._templUtils
var boilerUtils = altboilerScope._boilerUtils

/*
 * Gets all includes from the manifest
 * It's used in different places inside this script,
 * So its easiest to just put it here.
 */
var allIncludes = maniUtils.getIncludes(MANIFESTS[CURRENT_ARCH].manifest)

/*
 * This listenes for all routes,
 * but doesn't conflict with any resources
 */
WebApp.connectHandlers.use(function (req, res, next) {
  res.end(altboiler.Boilerplate())
})

/*
 * This serves the concateneted app script.
 */
WebApp.rawConnectHandlers.use(APP_SCRIPT, function (req, res, next) {
  res.end(maniUtils.getScripts(allIncludes['js']))
})

/* altboiler(options)
 * `options` - an object containing options
 * returns the new `altboiler.config`
 * Adds the options to the exsisting `altboiler.config`.
 */
altboiler = function altboiler (options) {
  return altboiler.config = _.extend(options, altboiler.config)
}

/*
 * The default configuration
 * Just sets `assets/default.html` as it's action
 */
altboiler.config = {
  /* fadeOut(next)
   * `next` - The callback
   * A default onLoad hook that let's the `altboiler_boilerPlateLoader` disapear
   */
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

/* altboiler.getTemplate(templateName)
 * `templateName` - The name of a template
 * returns the rendered template if its found, if not it returns `templateName`
 * Renders a template and returns HTML
 * You can bind a context to it to use it as a context for the template
 */
altboiler.getTemplate = function getTemplate (templateName) {
  var rawTemplate = templUtils.getRawTemplate(templateName)
  if(!rawTemplate) return templateName
  SSR.compileTemplate(templateName, rawTemplate)
  return SSR.render(templateName, this)
}

/* altboiler.Boilerplate()
 * returns the rendered boilerplate
 * It renderes the template `assets/main.html`
 */
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
