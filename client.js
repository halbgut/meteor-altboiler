if(altboiler.getConfig('showLoader')) return

debugger

document.head.innerHTML +=
  ['<link rel="stylesheet" type="text/css" src="', '">']
    .join(altboiler.getConfig('routes').css)
