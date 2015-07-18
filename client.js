var configUtils = _altboilerScope.configUtils

/* Wait until the client-side configuration has been done */
addEventListener('load', function () {
  /* Don't do anything if the loader should be shown */
  if(configUtils.isTruthy(altboiler.getConfig('showLoader'))) return

  /* Load the static CSS defined for the altboiler */
  document.head.innerHTML +=
    ['<link rel="stylesheet" type="text/css" href="', '">']
      .join(altboiler.getConfig('routes').css)
})
