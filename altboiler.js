
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

  /* altboiler(options)
   * `options` - an object containing options
   * returns the new `altboiler.config`
   * Adds the options to the exsisting `altboiler.config`.
   */
   altboiler.configure = function config (options) {
    return this.config = _.extend(this.config, options)
  }

  /* altboiler.config
   * The default configuration
   * Just sets `assets/default.html` as it's action
   */
   altboiler.config = {
    /* action
     * The action called inside the load template
     */
    action: 'assets/default.html'
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
    return this.onLoadHooks.push(func) - 1
  }

  /* altboiler.onLoadHooks
   * An array contains all onLoad hooks.
   */
   altboiler.onLoadHooks = [
    /* fadeOut(next)
     * `next` - The callback
     * A default onLoad hook that let's the `altboiler_boilerPlateLoader` disapear
     */
    function fadeOut (next) {
      document.getElementById('altboiler_boilerPlateLoader').style.opacity = 0
      setTimeout(next, 200)
    }
  ]

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

  /* altboiler.css(css)
   * `css` - A string containing CSS
   * returns the index of the CSS inside `hookedCss`
   * Pushes strings to `hookedCss`
   */
   altboiler.css = function css (css) {
    return this.hookedCss.push(css) - 1
  }

  /* altboiler.hookedCss
   * An array containing CSS
   * The CSS will be rendered into the loading template
   */
   altboiler.hookedCss = [
    /* The default styles, they may be removed by accessing this array directly */
    Assets.getText('assets/styles.css')
  ]

  /* altboiler.js(js)
   * `js` - A string containing JS
   * returns the index of the JS inside `hookedJs`
   * Pushes strings to `hookedJs`
   */
   altboiler.js = function js (js) {
    return this.hookedJs.push(js) - 1
  }

  /* altboiler.hookedJs
   * An array containing js
   * The JS will be rendered into the loading template
   * (after loader.js)
   */
   altboiler.hookedJs = []

  /* altboiler.Boilerplate()
   * returns the rendered boilerplate
   * It renderes the template `assets/main.html`
   */
  // Returns the generated boilerplate
  altboiler.Boilerplate = function Boilerplate () {
    return this.getTemplate.call(
      boilerUtils.getBoilerTemplateData(
        maniUtils.getIncludes(WebApp.clientPrograms[CURRENT_ARCH].manifest),
        APP_SCRIPT,
        this.renderAction(this.config.action),
        this.onLoadHooks,
        this.hookedCss,
        this.hookedJs
      ),
      'assets/main.html'
    )
  }

  /* altboiler.renderAction(action)
   * `action` - A template's filename, function or a simple string of HTML
   * returns the rendered action.
   */
  altboiler.renderAction = function renderAction (action) {
    if(typeof action === 'function') return action()
    if(typeof action === 'string') {
      if(action.substr(-5) === '.html') return this.getTemplate(action)
      return action
    }
  },

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
