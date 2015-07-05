/* compatUtils.js
 * Defines a utility to encrease compatibility
 */
var compatUtils
_altboilerScope = _altboilerScope || {}
compatUtils = _altboilerScope.compatUtils || {}

/* compatUtils.compat
 * An array of compatible packages
 * Each item should be a function
 */
compatUtils.compat = compatUtils.compat || []

/* compatUtils(serveLoader, skipLoader)
 * `serveLoader` - The function to call when the loader should be served
 * `skipLoader` - The function to call when the loader should be skipped
 */
var _compatUtils = function compatUtils (serveLoader, skipLoader, URL) {
  compatUtils.shouldServeLoader(URL) ?
    serveLoader() : skipLoader()
}
compatUtils = _.extend(_compatUtils, compatUtils)

/* compatUtils.shouldServeLoader
 * Loops throught compat and calls each function
 */
compatUtils.shouldServeLoader = function shouldServeLoader (URL) {
  return _.every(
    compatUtils.compat,
    function (func) {
      return func(URL)
    }
  )
}

/*
 * So that there's always one function returning true
 */
compatUtils.compat.push(_.identity.bind(null, true))

_altboilerScope.compatUtils = compatUtils
