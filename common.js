var configUtils = _altboilerScope.configUtils

/* Altboiler()
 * `altboiler`'s prototype
 */
Altboiler = {}

/* altboiler.configuration
 * The default configuration
 */
Altboiler.configuration = false

/* altboiler.config(config)
 * `config` - An object which is merged with the current configuration
 * returns the new configuration
 */
Altboiler.config = function config (config) {
  return this.configuration = (
    this.configuration ?
      configUtils.deepMerge(this.configuration, config) :
      config
  )
}

/* altboiler.tmpConf
 * This object overrides altboiler.configuration
 * The object is emptied after every call to `Boilerplate`
 */
 Altboiler.tmpConf = false

/* altboiler.set(config)
 * `config` - An object which is merged with the current configuration
 * The options configured here will only be used once
 */
Altboiler.set = function set (config) {
  return this.tmpConf = config
}

/* altboiler.getConfig(option)
 * `option` the key of a cretain option
 * Deep-merges tempConf and configuration and returns it
 */
Altboiler.getConfig = function getConfig (option) {
  /* Tolerance for when `altboiler.set` isn't called */
  this.tmpConf = this.tmpConf || {}
  var config = configUtils.deepMerge(
    this.configuration,
    this.tmpConf
  )
  return option ? config[option] : config
}

/* Create altboiler */
altboiler = Object.create(Altboiler)

/* Configuration options that must be server-side */
altboiler.configuration = {
  /* Functions to be executed when the app script has loaded */
  onLoad: [],

  /* Wether to load altboiler or the default boilerplate */
  showLoader: true,

  /* Mainly for internal purposes, they may be changed. I don't see a reason why dough */
  routes: {
    /* The route where the main (meteor) app script should be served */
    script: '/altboiler/main.js',

    /* The route where the css defined inside altboiler should be served */
    styles: '/altboiler/styles.css'
  }
}
