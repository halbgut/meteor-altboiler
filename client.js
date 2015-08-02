var configUtils = _altboilerScope.configUtils

/* Wait until the client-side configuration has been done */
addEventListener('load', function () {
  var showLoader = altboiler.getConfig('showLoader')
  /* Clear the object */
  altboiler.tmpConf = {}
  /* Don't do anything if the loader should be shown */
  if(configUtils.isTruthy(showLoader)) return

  /* Load the static CSS defined for the altboiler */
  document.head.innerHTML +=
    ['<link rel="stylesheet" type="text/css" href="', '">']
      .join(altboiler.getConfig('routes').css)
})
