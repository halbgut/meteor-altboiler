/* templUtils
 * This object holds functions that help the public getTemplate function
 */

/* External includes */
var fs = Npm.require('fs')

var templUtils = {}

templUtils.getRawTemplate = function getRawTemplate (templateName) {
  var returnVal = false
  var locations = [
    'templates/' + templateName + '.html',
    templateName + '.html',
  ]
  _.each(locations, function (filepath) {
    if(fs.existsSync('./private/' + filepath)) returnVal = Assets.getText(filepath)
  })
  return (returnVal ? returnVal : Assets.getText('assets/' + templateName + '.html'))
}

altboilerScope = altboilerScope || {}
altboilerScope._templUtils = templUtils