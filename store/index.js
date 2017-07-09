import * as store from 'store/dist/store.modern'

export const state = {
  isPaused: true,
  mousePosition: {
    x: 0,
    y: 0
  }
}

export const actions = {
  addSaveGame (vStore, save) {
    const saves = store.get('saves') || []
    saves.push(save)
    store.set('saves', saves)
  },
  deleteSaveGame (vStore, saveIndex) {
    const saves = store.get('saves')
    saves.splice(saveIndex, 1)
    store.set('saves', saves)
  },
  storeState ({ state }) {
    store.set('state', state)
  },
  restoreState ({ commit }, state) {
    commit('SET_STATE', state)
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