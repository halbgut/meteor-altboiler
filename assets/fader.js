/* fadeer.js
 * This makes the load screen fade in nicely.
 * This prevents falshing
 * I actually need to do the animation in JS
 * Otherwise the loadscreen would fade in and vanish
 * If the load time was under 400ms
 */

var Fader = {
  frameRate: 100,
  time: 1000,
  direction: 1,
  opacity: 0,

  calculateStep: function () {
    this.step = 1 / this.time * this.frameRate
  },

  fade: function () {
    var newOpacity = this.opacity + this.step * this.direction
    if(this.stop || newOpacity < 0 || newOpacity > 1) return
    this.target.style.opacity = this.opacity = newOpacity
    setTimeout(this.fade.bind(this), this.frameRate)
  }
}

var inFader = Object.create(Fader)
inFader.target = document.getElementById('altboiler_boilerPlateLoader')
inFader.calculateStep()
inFader.fade()

altboiler.loader.onLoad(function stopFadeIn (next) {
  var outFader = Object.create(Fader)
  inFader.stop = true
  outFader.opacity = inFader.opacity
  outFader.target = inFader.target
  outFader.direction = -1
  outFader.calculateStep()
  outFader.fade()

  setTimeout(
    next,
    (outFader.time / outFader.opacity)
  )
})
