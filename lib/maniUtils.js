/* maniUtils
 * This Object holds all functions to parse manifests to HTML
 */

var maniUtils = {}

var fs = Npm.require('fs')
var path = Npm.require('path')

/* maniUtils.currentArch
 * The current architecture
 */
maniUtils.currentArch = WebApp.defaultArch

/* maniUtils.manifests
 * The manifests as defined by meteor
 */
maniUtils.manifests = WebApp.clientPrograms[maniUtils.currentArch].manifest

maniUtils.getIncludes = function getIncludes () {
  var filteredIncludes = maniUtils.filterIncludes(maniUtils.manifests)
  filteredIncludes['js'] = filteredIncludes['js'].concat(maniUtils.parseStaticJS(WebAppInternals.additionalStaticJs))
  return filteredIncludes
}

/* maniUtils.filterIncludes(manifest)
 * `manifest` - the manifest to loop through
 * loops through a manifest and calls the `maniUtils.transform` function named the same as the items `type`
 */
maniUtils.filterIncludes = function filterIncludes (manifest) {
  var returnObj = {
    js: [],
    css: [],
    head: [],
    body: []
  }
  _.each(manifest, function (include) {
    var type = include.type
    if(maniUtils.transform[type])
      maniUtils.transform[type](include, returnObj)
  })
  return returnObj
}

maniUtils.transform = {}

/* maniUtils.transform.js(include)
 * `include` an object structured like a manifest item
 * returns a URL a script
 */
maniUtils.transform.js = function transformJs (include, includesObject) {
  includesObject['js'].push(
    (include.where === 'client') ?
      include.path :
      false
  )
}

/* maniUtils.transform.css(include, includesObject)
 * `include` - an object structured like a manifest item
 * `includesObject` - The returnObj to modifiy
 * returns the url to a css file
 */
maniUtils.transform.css = function transformCss (include, includesObject) {
  includesObject['css']
    .push(
      ['<link type="text/css" rel="stylesheet" href="', '">']
        .join(include.url)
    )
}

/* maniUtils.transform.head(include, includesObject)
 * `include` - an object structured like a manifest item
 * `includesObject` - The returnObj to modifiy
 * returns a piece of HTML that should be included in the `head`
 */
maniUtils.transform.head = function transformHead (include, includesObject) {
  includesObject['head']
    .push(maniUtils.getResource(include.path))
}

/* maniUtils.transform.body(include, includesObject)
 * `include` - an object structured like a manifest item
 * `includesObject` - The returnObj to modifiy
 * returns a piece of HTML that should be included in the `body`
 */
maniUtils.transform.body = function transformBody (include, includesObject) {
  includesObject['body']
    .push(maniUtils.getResource(include.path))
}

maniUtils.parseStaticJS = function parseStaticJS (staticJsObj) {
  var returnArr = []
  _.each(staticJsObj, function (js, key) {
    returnArr.push({
      type: 'js',
      url: key
    })
  })
  return returnArr
}

/* maniUtils.getResource(path)
 * `path` - A path to the resource relative to the resources directory
 * returns the file as a string
 */
 maniUtils.getResource = function getResource (path) {
  return fs.readFileSync(maniUtils.pathMapper(path), {encoding: 'utf8'})
 }

/* maniUtils.pathMapper(path)
 * `path` - A path to the resource relative to the resources directory
 * Returns a path relative to $PWD
 * Taken from the WebApp package
 * https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js#L287
 */
maniUtils.pathMapper = function pathMapper (itemPath) {
  return path.join(maniUtils.getResourcesPath(), itemPath)
}

/* maniUtils.getResourcesPath()
 * Returns a Path to the resources
 * This is sort of a necessary evil
 * It's super ugly, but meteor doesn't provide me with anything better
 * https://github.com/meteor/meteor/blob/devel/packages/webapp/webapp_server.js#L509
 */
maniUtils.getResourcesPath = (function getResourcesPath () {
  var cachedResourcesPath
  return function getResourcesPathGetter () {
    return cachedResourcesPath || (
      cachedResourcesPath = path.dirname(__meteor_bootstrap__.configJson.clientPaths[maniUtils.currentArch])
    )
  }
})()

/* maniUtils.getScripts(jsPaths)
 * `jsPaths` - A ressource path to a script
 * returns all scripts inside the array concatenated in a string
 */
maniUtils.getScripts = function getScripts (jsPaths) {
  return _.map(jsPaths, maniUtils.getResource).join('\n')
}

_altboilerScope = _altboilerScope || {}
_altboilerScope.maniUtils = maniUtils
