// When this is used client side, altboiler wont be defined
var loader = {}

loader.onLoadQueue = []

loader.onLoad = function onLoad (func) {
  if(typeof func == 'object') return func.forEach(loader.onLoad)
  if(typeof func == 'string') func = eval('return ' + func)
  if(func) loader.onLoadQueue.push(func)
}

loader.runOnLoadQueue = function runOnLoadQueue (queue) {
  queue = queue || loader.onLoadQueue
  if(!queue.length) return
  queue.pop()(loader.runOnLoadQueue.bind(null, queue))
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
    console.log('rm')
    next()
  }
}

if (typeof window !== 'undefined') {
  window.altboiler = {}
} else {
  altboiler = altboiler || {}
}
altboiler.loader = loader