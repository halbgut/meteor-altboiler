
var maniUtils = _altboilerScope.maniUtils
var boilerUtils = _altboilerScope.boilerUtils

/*********************************
 *********** DEFINITION **********
 *********************************/

/* _Altboiler(maniUtils, templUtils, boilerUtils)
 * `maniUtils` - Utilities for the handling of manifests
 * `boilerUtils` - Utilities to help generating the boilerplate
 * returns an instance of `altboiler`
 * This function exsists just to make the thing easier to test.
 * All functions inside this object are exported.
 * It's to make testing easier.
 */
_Altboiler = function Altboiler (
  maniUtils,
  boilerUtils
) {

  var altboiler = {}
  /* altboiler.configuration
   * The default configuration
   */
  altboiler.configuration = {
    /* action
     * The action called inside the load template
     */
    action: 'assets/default.html',
    css: [],
    js: [],
    onLoad: [
      function fadeOut (next) {
        document.getElementById('altboiler_boilerPlateLoader').style.opacity = 0
        setTimeout(next, 200)
      }
    ]
  }

  /* altboiler.config(config)
   * `config` - An object which is merged with the current configuration
   * returns the new configuration
   */
  altboiler.config = function config (config) {
    return this.configuration = _.extend(this.configuration, config)
  }

  /* altboiler.getTemplate(templateName, assets)
   * `templateName` - The filename of a template
   * `assets` - Meteors `Assets` object
   * returns the rendered template if its found, if not it returns `templateName`
   * Renders a template and returns HTML
   * You can bind a context to it to use it as a context for the template
   * The `assets` argument is required, because otherwise I can't access the apps assets
   */
   altboiler.getTemplate = function getTemplate (templateName, assets) {
    assets = assets || Assets
    var rawTemplate = templateName.substr(-5) === '.html' ? assets.getText(templateName) : templateName
    if(!rawTemplate) return templateName
    SSR.compileTemplate(templateName, rawTemplate)
    return SSR.render(templateName, this)
  }

  /* altboiler.Boilerplate()
   * returns the rendered boilerplate
   * It renderes the template `assets/main.html`
   */
  altboiler.Boilerplate = function Boilerplate () {
    return this.getTemplate.call(
      boilerUtils.getBoilerTemplateData(
        maniUtils.getIncludes(WebApp.clientPrograms[CURRENT_ARCH].manifest),
        APP_SCRIPT,
        this.renderAction(this.configuration.action),
        this.configuration
      ),
      'assets/main.html'
    )
  }

  /* altboiler.renderAction(action)
   * `action` - A template's filename, function or a simple string of HTML
   * returns the rendered action.
   */
  altboiler.renderAction = function renderAction (action, assets) {
    if(typeof action === 'function') return action()
    if(typeof action === 'string') {
      if(action.substr(-5) === '.html') return this.getTemplate(action, assets)
      return action
    }
  }

  return altboiler
}

/*********************************
 ********* GLOBAL STATE **********
 *********************************/

/*
 * This creates a global instance of `_Altboiler`
 */
altboiler = new _Altboiler(
  maniUtils,
  boilerUtils
)

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
var allIncludes = maniUtils.getIncludes(WebApp.clientPrograms[CURRENT_ARCH].manifest)
WebApp.rawConnectHandlers.use(APP_SCRIPT, function (req, res, next) {
  res.end(maniUtils.getScripts(allIncludes['js']))
})
