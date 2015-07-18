/* Don't do anything if the loader should be shown */
if(altboiler.getConfig('showLoader')) return

/* Load the static CSS defined for the altboiler */
document.head.innerHTML +=
  ['<link rel="stylesheet" type="text/css" src="', '">']
    .join(altboiler.getConfig('routes').css)
