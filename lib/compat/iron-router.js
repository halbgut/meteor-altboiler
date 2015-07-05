var compatUtils
_altboilerScope = _altboilerScope || {}
compatUtils = _altboilerScope.compatUtils || {}
compatUtils.compat = compatUtils.compat || []

compatUtils.compat.push(function checkForIronRoute (URL) {
  var Iron
  if(!(Iron = Package['iron:router'])) return false
  return !Iron.Router.findFirstRoute(URL)
})

_altboilerScope.compatUtils = compatUtils
