var maniUtils = _altboilerScope.maniUtils
var boilerUtils = _altboilerScope.boilerUtils
var configUtils = _altboilerScope.configUtils

/*********************************
 *********** DEFINITION **********
 *********************************/

/* This shouldn't */
altboiler.config({
    content: '',
    action: Assets.getText('assets/default.html'),
    css: [Assets.getText('assets/styles.css')],
    js: [Assets.getText('assets/fader.js')],
})

/* altboiler.Boilerplate()
 * returns the rendered boilerplate
 * It renderes the template `assets/main.html`
 */
Altboiler.Boilerplate = (function () {
  var mainTemplate = SpacebarsCompiler.compile(Assets.getText('assets/main.html'), { isBody: true })
  return function Boilerplate (config) {
    config = config || this.configuration
    return Blaze.toHTML(Blaze.With(
      boilerUtils.getBoilerTemplateData(
        maniUtils.getIncludes(),
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
Altboiler.serveBoilerplate = function serveBoilerplate (req, res, next) {
  var config = this.getConfig()
  this.tmpConf = {}
  if(configUtils.isTruthy(config.showLoader)) {
    res.end(this.Boilerplate(config))
  } else {
    next()
  }
}

/*********************************
 ***** LISTEN FOR CONNECTIONS ****
 *********************************/

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
  WebApp.connectHandlers.use(
    altboiler.serveBoilerplate.bind(altboiler)
  )
})

/*
 * This serves the concatenated app script.
 */
var appScript = maniUtils.getScripts(maniUtils.getIncludes()['js'])
WebApp.rawConnectHandlers.use(
  altboiler.getConfig('routes').main,
  function (req, res, next) {
    res.end(appScript)
  }
)

/*
 * This route serves the static css you added via the configuration
 */
WebApp.rawConnectHandlers.use(altboiler.getConfig('routes').css, function serveStaticCss (req, res, next) {
  res.end([].concat(altboiler.getConfig('css')).join('\n'))
})
