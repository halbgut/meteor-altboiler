var loader = {}

loader.onLoadQueue = []

/* altboiler.loader.onLoad(func)
 * `func` - A function or a function name or an array of these
 * returns the index of the newly pushed functions
 * pushes functions to the loader.onLoadQueue
 */
loader.onLoad = function onLoad (func) {
  if(typeof func == 'object') return func.forEach(this.onLoad.bind(this))
  if(typeof func == 'string') eval('func = ' + func)
  if(func) return this.onLoadQueue.push(func) - 1
}

/* altboiler.loader.runOnLoadQueue([queue])
 * `queue` - The remaining onLoadQue
 * Recursively runs all functions inside loader.onLoadQueue in reverse order
 */
loader.runOnLoadQueue = function runOnLoadQueue (queue) {
  queue = queue || this.onLoadQueue
  if(!queue.length) return
  queue.pop()(this.runOnLoadQueue.bind(this, queue))
}

/* altboiler.loader.appender(head, body)
 * `head` - code to be appended to the head element
 * `body` - code to be appended to the body element
 * returns a function that appends the stuff
 * This is an internal helper.
 * It's just to keep assets/main.html clean
 */
loader.appender = function appender (head, body) {
  return function appendBodyAndHead (next) {
    if(head) document.head.innerHTML += decodeURIComponent(head)
    if(body) document.body.innerHTML += decodeURIComponent(body)
    next()
  }
}

/* altboiler.loader.removerBtId(elementId)
 * `elementId` - The id property of the element to be removed
 * returns a function that removes the element
 * This is an internal helper.
 * It's just to keep assets/main.html clean
 */
loader.removerById = function removerById (elementId) {
  return function removeById (next) {
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
