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
  return this.configuration ?
    _.extend(this.configuration, config) :
    (this.configuration = config)
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

Altboiler.getConfig = function getConfig (option) {
  /* Tolerance for when `altboiler.set` isn't called */
  this.tmpConf = this.tmpConf || {}
  var config = configUtils.deepMerge(
    this.configuration,
    this.tmpConf
  )
  return option ? config[option] : config
}

altboiler = Object.create(Altboiler)
