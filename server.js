var maniUtils = _altboilerScope.maniUtils
var boilerUtils = _altboilerScope.boilerUtils
var configUtils = _altboilerScope.configUtils
var StaticUtils = _altboilerScope.StaticUtils

/*********************************
 *********** DEFINITION **********
 *********************************/


altboiler._staticFiles = Object.create(StaticUtils)
altboiler._staticFiles.add(
  'script',
  altboiler.getConfig('routes').script,
  maniUtils
    .getScripts(maniUtils.getIncludes()['js'])
)
altboiler._staticFiles.add(
  'styles',
  altboiler.getConfig('routes').styles,
  []
    .concat(altboiler.getConfig('css'))
    .join('\n')
)

/* Configuration options that can be set server-side */
altboiler.config({
    /* HTML that should be loaded and not removed onLoad */
    content: '',

    /* HTML that is removed onLoad */
    action: Assets.getText('assets/default.html'),

    /* CSS that is served with the boilerplate, is also served when the normal boilerplate is loaded */
    css: [Assets.getText('assets/styles.css')],

    /* JS that is removed onLoad */
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
        config,
        this._staticFiles.get('script').url
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
; (function () {
  var scriptFile = altboiler._staticFiles.get('script')
  WebApp.rawConnectHandlers.use(
    scriptFile.path,
    function (req, res, next) {
      res.setHeader('Cache-Control', 'public, max-age=31536000')
      res.setHeader('ETag', scriptFile.etag)
      res.setHeader('Last-Modified', scriptFile.lastModified)
      res.end(scriptFile.file)
    }
  )
})()

/*
 * This route serves the static css you added via the configuration
 */
WebApp.rawConnectHandlers.use(
  altboiler._staticFiles.get('styles').path,
  function serveStaticCss (req, res, next) {
    res.end(altboiler._staticFiles.get('styles').file)
  }
)
