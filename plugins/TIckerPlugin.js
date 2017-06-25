import Vue from 'vue'

class Ticker {
  constructor () {
    this.hasStarted = false
    this.isRunning = false
    this.functions = []
  }
  add (fn, interval = 1) {
    this.functions.push({ fn, interval, lastTick: Date.now() })
  }
  remove (fn) {
    const index = this.functions.findIndex(f => f.fn === fn)
    if (index === -1) return
    this.functions.splice(index, 1)
  }
  tick () {
    const currentTick = Date.now()
    for (let f of this.functions) {
      if (currentTick - f.lastTick >= f.interval) {
        f.lastTick = currentTick
        f.fn()
      }
    }
  }
  start () {
    this.isRunning = true
    const _tick = () => {
      if (!this.isRunning) return
      this.tick()
      setTimeout(() => { _tick() }, 1)
    }
    _tick()
    this.isRunning = true
  }
  stop () {
    this.isRunning = false
  }
}
const plugin = {
  install (Vue, options) {
    Vue.prototype.Ticker = new Ticker()
  }
}

Vue.use(plugin)