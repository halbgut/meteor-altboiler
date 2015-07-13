/* configUtils.js
 * Defines an object that provides functions to manipulate the configuration object
 */

var configUtils = {}

/* configUtils.isTruthy(thing, ...)
 * `thing` - An array of thing else that is evaluated
 * `...` - Arguments passed to functions inside `thing`
 */
configUtils.isTruthy = function isTruthy (thing/*, ...*/) {
  return _.every([].concat( this.execFuncs.apply(this, arguments) ))
}

/* configUtils.execFuncs(thing)
 * `thing` - A template's filename, function or a simple string of HTML
 * `...` - Arguments passed to the `thing` if it's a function
 * returns the rendered thing.
 */
configUtils.execFuncs = function execFuncs (thing/* ... */) {
  if(Array.prototype.isPrototypeOf(thing)) {
    return thing.map(this.execFuncs.bind(this))
  } else if(typeof thing === 'function') {
    return thing.apply(null, _.rest(arguments))
  }
  return thing
}

_altboilerScope = _altboilerScope || {}
_altboilerScope.configUtils = configUtils
