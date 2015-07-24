/* StaticUtils
 * A utilitiy object to handle static files
 */

var StaticUtils = {}

StaticUtils._files = undefined

/* StaticUtils.add(route, content)
 * `route` - The route to serve on
 * `content` - The files content
 * returns the new length og _files
 */
StaticUtils.add = function staticUtilsAdd (route, path, content) {
  this._files = this._files || {}
  var hash = SHA256(content)
  return this._files[route] = {
    path: path,
    file: content,
    hash: hash,
    url: [path, hash].join('?'),
    etag: '0-' + makeNumeric(hash),
    lastModified: (new Date()).toUTCString()
  }
}

/* StaticUtils.get(route)
 * `route` - The route you want
 * returns the requested route
 */
StaticUtils.get = function StaticUtilsGet (route) {
  return this._files[route]
}

function makeNumeric (str) {
  return Number(str.split('').map(function (char) {
    console.log(char.charCodeAt(0))
    return char.charCodeAt(0)
  }).join('').substr(0, 15))
}

_altboilerScope = _altboilerScope || {}
_altboilerScope.StaticUtils = StaticUtils
