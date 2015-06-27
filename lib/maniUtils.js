/* maniUtils
 * This Object holds all functions to parse manifests to HTML
 */

var fs = Npm.require('fs')
var path = Npm.require('path')

// This holds all variables that will be exported from this file
// It's just an experiment to make the meteor scoping system inside packages hurt less...
var maniUtils = {}

maniUtils.getIncludes = function getIncludes (manifest) {
  var filteredIncludes = maniUtils.filterIncludes(manifest)
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
  manifest.forEach(function (include) {
    var type = include.type
    returnObj[type].push(maniUtils.transform[type](include))
  })
  return returnObj
}

maniUtils.transform = {}

/* maniUtils.transform.js(include)
 * `include` an object structured like a manifest item
 * returns a URL a script
 */
maniUtils.transform.js = function transformJs (include) {
  return include.url
}

/* maniUtils.transform.css(include)
 * `include` an object structured like a manifest item
 * returns the url to a css file
 */
maniUtils.transform.css = function transformCss (include) {
  return include.url
}

/* maniUtils.transform.head(include)
 * `include` an object structured like a manifest item
 * returns a piece of HTML that should be included in the `head`
 */
maniUtils.transform.head = function transformHead (include) {
  return fs.readFileSync(maniUtils.pathMapper(include.path), {encoding: 'utf8'})
}

/* maniUtils.transform.body(include)
 * `include` an object structured like a manifest item
 * returns a piece of HTML that should be included in the `body`
 */
maniUtils.transform.body = function transformHead (include) {
  return fs.readFileSync(maniUtils.pathMapper(include.path), {encoding: 'utf8'})
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
      cachedResourcesPath = path.dirname(__meteor_bootstrap__.configJson.clientPaths[currentArch])
    )
  }
})()

altboilerScope = altboilerScope || {}
altboilerScope._maniUtils = maniUtils