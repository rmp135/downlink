import * as store from 'store'

export const state = {
  isPaused: false,
  mousePosition: {
    x: 0,
    y: 0
  }
}

export const actions = {
  storeState (store) {

  },
  restoreState () {

  }
}

export const mutations = {
  UPDATE_MOUSE (state, e) {
    state.mousePosition.x = e.clientX
    state.mousePosition.y = e.clientY
  },
  SET_PAUSED (state, paused) {
    state.isPaused = paused
  }
}