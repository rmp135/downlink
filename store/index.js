import * as store from 'store/dist/store.modern'

export const state = {
  isPaused: false,
  mousePosition: {
    x: 0,
    y: 0
  }
}

export const actions = {
  storeState ({ state }) {
    store.set('state', state)
  },
  restoreState ({ commit }) {
    commit('SET_STATE', store.get('state'))
  }
}

export const mutations = {
  UPDATE_MOUSE (state, e) {
    state.mousePosition.x = e.clientX
    state.mousePosition.y = e.clientY
  },
  SET_PAUSED (state, paused) {
    state.isPaused = paused
  },
  SET_STATE(state, newState) {
    Object.assign(state, newState)
  }
}