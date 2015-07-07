/* fadeIn.js
 * This makes the load screen fade in nicely.
 * This prevents falshing
 * I actually need to do the animation in JS
 * Otherwise the loadscreen would fadeIn and vanish
 * If the load time was under 400ms
 */
var totalTimeStep = 400
var timeSingleStep = 10
var totalSteps = Math.round(totalTimeStep / timeSingleStep)
var opacityStep = Math.round(100 / totalSteps) / 100
window.altboiler_stopStepping = false
function fadeIn () {
  var targetElem = document.getElementById('altboiler_boilerPlateLoader')
  fadeInALittle(targetElem, 0)
}
function fadeInALittle (targetElem, oldOpacity) {
  if(window.altboiler_stopStepping || oldOpacity > 1) return
  newOpacity = targetElem.style.opacity = oldOpacity + opacityStep
  setTimeout(fadeInALittle.bind(null, targetElem, newOpacity), timeSingleStep)
}
setTimeout(fadeIn, 0)

altboiler.loader.onLoad(function stopFadeIn (next) {
  window.altboiler_stopStepping = true
  document.getElementById('altboiler_boilerPlateLoader').style.opacity = 0
  next()
})
