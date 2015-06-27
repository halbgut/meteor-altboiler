/* maniUtils
 * This Object holds all functions to parse manifests to HTML
 */


// This holds all variables that will be exported from this file
// It's just an experiment to make the meteor scoping system inside packages hurt less...
var maniUtils = {}

maniUtils.getIncludes = function getIncludes (manifest) {
  return manifest.concat(maniUtils.parseStaticJS(WebAppInternals.additionalStaticJs))
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

altboilerScope = altboilerScope || {}
altboilerScope._maniUtils = maniUtils