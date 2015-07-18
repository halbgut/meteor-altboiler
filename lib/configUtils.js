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
  if(Array.isArray(thing)) {
    return thing.map(this.execFuncs.bind(this))
  } else if(typeof thing === 'function') {
    return thing.apply(null, _.rest(arguments))
  }
  return thing
}

/* configUtils.deepMerge(obj[, obj][, ...])
 * `obj` - An object
 */
configUtils.deepMerge = function deepMerge (/* arguments */) {
  var returnVal = _.reduce(arguments, function (merged, config) {
    merged = _.clone(merged)
    _.each(config, function (value, prop) {
      if(merged[prop] && Array.isArray(merged[prop])) {
        merged[prop] = merged[prop].concat(value)
      } else {
        merged[prop] = value
      }
    }, {})
    return merged
  })
  console.log(arguments[0].css, arguments[1].css)
  return returnVal
}

_altboilerScope = _altboilerScope || {}
_altboilerScope.configUtils = configUtils
