/* showLoaderUtils.js
 * Defines a utility to encrease compatibility
 */
var showLoaderUtils
_altboilerScope = _altboilerScope || {}
showLoaderUtils = _altboilerScope.showLoaderUtils || {}

/* showLoaderUtils(serveLoader, skipLoader)
 * `serveLoader` - The function to call when the loader should be served
 * `skipLoader` - The function to call when the loader should be skipped
 * ``
 */
 showLoaderUtils = function showLoaderUtils (serveLoader, skipLoader, URL, compat) {
  showLoaderUtils.shouldServeLoader(URL, compat) ?
    serveLoader() : skipLoader()
}

/* showLoaderUtils.shouldServeLoader
 * Loops throught compat and calls each function
 */
 showLoaderUtils.shouldServeLoader = function shouldServeLoader (URL, compat) {
  var typeOfCompat = typeof compat
  if(typeOfCompat === 'function') return compat()
  if(typeOfCompat === 'array') {
    return _.every(compat, this.shouldServeLoader.bind(this, URL))
  }
  return compat
}

_altboilerScope.showLoaderUtils = showLoaderUtils
