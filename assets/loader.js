var loader = {}

loader.onLoadQueue = []

loader.onLoad = function onLoad (func) {
  if(typeof func == 'object') return func.forEach(this.onLoad)
  if(typeof func == 'string') eval('func = ' + func)
  if(func) return this.onLoadQueue.push(func) - 1
}

loader.runOnLoadQueue = function runOnLoadQueue (queue) {
  queue = queue || this.onLoadQueue
  if(!queue.length) return
  queue.pop()(this.runOnLoadQueue.bind(this, queue))
}

loader.appender = function appender (head, body) {
  return function appendBodyAndHead (next) {
    if(head) document.head.innerHTML += decodeURIComponent(head)
    if(body) document.body.innerHTML += decodeURIComponent(body)
    next()
  }
}

loader.removerById = function removerById (elementId) {
  return function (next) {
    var removeThis = document.getElementById(elementId)
    removeThis.parentNode.removeChild(removeThis)
    next()
  }
}

/*
 * To make it run both client- and server-side,
 * I need to do this.
 * It only runs server side, when it's beeing tested
 * It's actually attached to an instance of _Altboiler
 * This looks pretty ugly.
 * But it's the *best* in this case
 */
if (typeof window !== 'undefined') {
  window.altboiler = {}
} else {
  altboiler = altboiler || {}
}
altboiler.loader = loader