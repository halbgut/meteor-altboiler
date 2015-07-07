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
  if(oldOpacity > 1) return
  newOpacity = targetElem.opacity = oldOpacity + opacityStep
  setTimeout(fadeInALittle.bind(null, targetElem, newOpacity), timeSingleStep)
}
setTimeout(fadeIn, 0)
