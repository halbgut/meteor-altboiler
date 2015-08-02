var configUtils = _altboilerScope.configUtils

/* Wait until the client-side configuration has been done */
addEventListener('load', function () {
  var showLoader = altboiler.getConfig('showLoader')
  var styles
  /* Clear the object */
  altboiler.tmpConf = {}
  /* Don't do anything if the loader should be shown */
  if(configUtils.isTruthy(showLoader)) return

  /* Load the static CSS defined for the altboiler */
  styles = document.createElement('link')
  styles.rel = 'stylesheet'
  styles.type = 'text/css'
  styles.href = altboiler.getConfig('routes').styles
  document.head.appendChild(styles)
})
