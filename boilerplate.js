(function Boilerplate (arch, manifests, options) {
  var state = 1
  if(state == 1) {
    state = 0
    WebApp.connectHandlers.use(function (req, res, next) {
      res.end(altboiler.getTemplate.call(
        altboiler.getTemplateData(
          manifests[arch].manifest,
          (altboiler.renderedAction || altboiler.renderAction()),
          altboiler.config
        ),
        'main'
      ))
    })
  }
})(WebApp.defaultArch, WebApp.clientPrograms, {})