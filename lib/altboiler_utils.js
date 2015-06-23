altboilerUtils = altboilerUtils || {}

// A function that retrieves plain text templates from the private/templates directory
altboilerUtils.getRawTemplate = function getRawTemplate (templateName) {
  var returnVal = false
  var locations = [
    'templates/' + templateName + '.html',
    templateName + '.html',
  ]
  _.each(locations, function (filepath) {
    if(fs.existsSync('./private/' + filepath)) returnVal = Assets.getText(filepath)
  })
  console.log(returnVal)
  return (returnVal ? returnVal : Assets.getText('assets/' + templateName + '.html'))
}