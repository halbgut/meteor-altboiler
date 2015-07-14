var maniUtils = _altboilerScope.maniUtils
var boilerUtils = _altboilerScope.boilerUtils
var configUtils = _altboilerScope.configUtils

/*********************************
 *********** DEFINITION **********
 *********************************/

/* _Altboiler(maniUtils, templUtils, boilerUtils)
 * `maniUtils` - Utilities for the handling of manifests
 * `boilerUtils` - Utilities to help generating the boilerplate
 * returns an instance of `altboiler`
 * This function exists just to make the thing easier to test.
 * All functions inside this object are exported.
 * It's to make testing easier.
 */
_Altboiler = function Altboiler (
  maniUtils,
  boilerUtils,
  configUtils
) {

  var altboiler = {}

  /* altboiler.configuration
   * The default configuration
   */
  altboiler.configuration = {
    /* action
     * The action called inside the load template
     */
    content: '',
    action: Assets.getText('assets/default.html'),
    css: [Assets.getText('assets/styles.css')],
    js: [Assets.getText('assets/fader.js')],
    onLoad: [],
    showLoader: true
  }

  /* altboiler.tmpConf
   * This object overrides altboiler.configuration
   * The object is emptied after every call to `Boilerplate`
   */
  altboiler.tmpConf = {}

  /* altboiler.config(config)
   * `config` - An object which is merged with the current configuration
   * returns the new configuration
   */
  altboiler.config = function config (config) {
    return _.extend(this.configuration, config)
  }


  /* altboiler.set(config)
   * `config` - An object which is merged with the current configuration
   * The options configured here will only be used once
   */
  altboiler.set = function set (config) {
    return this.tmpConf = config
  }

  /* altboiler.Boilerplate()
   * returns the rendered boilerplate
   * It renderes the template `assets/main.html`
   */
  altboiler.Boilerplate = (function () {
    var mainTemplate = SpacebarsCompiler.compile(Assets.getText('assets/main.html'), { isBody: true });
    return function Boilerplate (config) {
      config = config || this.configuration
      return Blaze.toHTML(Blaze.With(
        boilerUtils.getBoilerTemplateData(
          maniUtils.getIncludes(WebApp.clientPrograms[CURRENT_ARCH].manifest),
          APP_SCRIPT,
          configUtils.execFuncs(config.action),
          config
        ),
        eval(mainTemplate)
      ))
    }
  })()

  /* altboiler.serveBoilerplate(req, res, next)
   * `req` - `Object`: A request-obeject as defined by the node-docs
   * `res` - `Object`: A response-obeject as defined by the node-docs
   * `next` - `Function`: The next function on the stack check the [connect docs](https://www.npmjs.com/package/connect) for more info
   * The function used to serve the boilerplate
   * It manipulates the tempConf and checks showLoader
   */
  altboiler.serveBoilerplate = function serveBoilerplate (req, res, next) {
    var self = this
    var config = configUtils.deepMerge(self.configuration, self.tmpConf)
    self.tmpConf = {}
    if(configUtils.isTruthy(config.showLoader)) {
      res.end(self.Boilerplate(config))
    } else {
      next()
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
  boilerUtils,
  configUtils
)

/*
 * This listens for all routes,
 * but doesn't conflict with any resources
 * I'm putting this to the end of the queue
 * to make sure it gets added last.
 * If I wouldn't do this, iron:router server-side would break.
 * This isn't perfect, because a component of your app might
 * try add a handler to serve a ressource asynchronously.
 * That's why the `showLoader` options exists.
 */
_.defer(function () {
  WebApp.connectHandlers.use(altboiler.serveBoilerplate.bind(altboiler))
})

/*
 * This serves the concatenated app script.
 */
var allIncludes = maniUtils.getIncludes(WebApp.clientPrograms[CURRENT_ARCH].manifest)
WebApp.rawConnectHandlers.use(APP_SCRIPT, function (req, res, next) {
  res.end(maniUtils.getScripts(allIncludes['js']))
})
