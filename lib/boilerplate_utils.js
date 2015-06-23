altboilerUtils = altboilerUtils || {}

altboilerUtils.getIncludes = function getIncludes (manifest) {
  return manifest.concat(parseStaticJS(WebAppInternals.additionalStaticJs))
}

function parseStaticJS (staticJsObj) {
  var returnArr = []
  _.each(staticJsObj, function (js, key) {
    returnArr.push({
      type: 'js',
      url: key
    })
  })
  return returnArr
}

// For testing
altboilerUtils.parseStaticJS = parseStaticJS