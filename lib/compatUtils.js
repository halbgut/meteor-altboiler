/* compatUtils.js
 * Defines a utility to encrease compatibility
 */
var compatUtils
_altboilerScope = _altboilerScope || {}
compatUtils = _altboilerScope.compatUtils || {}

/* compatUtils(serveLoader, skipLoader)
 * `serveLoader` - The function to call when the loader should be served
 * `skipLoader` - The function to call when the loader should be skipped
 * ``
 */
compatUtils = function compatUtils (serveLoader, skipLoader, URL, compat) {
  compatUtils.shouldServeLoader(URL, compat) ?
    serveLoader() : skipLoader()
}

/* compatUtils.shouldServeLoader
 * Loops throught compat and calls each function
 */
compatUtils.shouldServeLoader = function shouldServeLoader (URL, compat) {
  var typeOfCompat = typeof compat
  if(typeOfCompat === 'function') return compat()
  if(typeOfCompat === 'array') {
    return _.every(compat, this.shouldServeLoader.bind(this, URL))
  }
  return compat
}

_altboilerScope.compatUtils = compatUtils
