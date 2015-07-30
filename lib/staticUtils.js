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
  /*
   * This used to be a realy hash,
   * but it using the meteor core SHA264
   * is 10x slow than this.
   */
  var hash = Base64.encode((new Date()) + route)
  return this._files[route] = {
    path: path,
    file: content,
    hash: hash,
    url: [path, hash].join('?'),
    etag: ['"','"'].join(hash),
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

/* StaticUtils.server(route)
 * Serves a certain file
 * `route` - The route of the file you want to serve
 * It also has a caching mechanism
 */
StaticUtils.server = function StaticUtilsServer (route) {
  var self = this
  var file = this.get(route)
  return function StaticUtilsServe (req, res) {
    self.setHeaders(file, res)
    if(req.headers['if-none-match'] === file.etag) {
      res.writeHeader(304)
      res.end('')
    } else {
      res.end(file.file)
    }
  }
}

/* StaticUtils.setHeaders(file, res)
 * `file` - An object created using `add`
 * `res` - A standard node response object
 * Sets caching headers for a requested file
 */
StaticUtils.setHeaders = function StaticUtilsSetHeaders (file, res) {
  res.setHeader('Cache-Control', 'public, max-age=31536000')
  res.setHeader('ETag', file.etag)
  res.setHeader('Last-Modified', file.lastModified)
}

_altboilerScope = _altboilerScope || {}
_altboilerScope.StaticUtils = StaticUtils
