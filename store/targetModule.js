export const state = {
  isLoggedIn: false,
  target: null,
}

export const getters = {
  isConnected (state) {
    return state.target !== null
  },
  isLoggedIn (state, getters) {
    return getters.isConnected && state.isLoggedIn
  }
}

export const mutations = {
  SET_IS_LOGGED_IN (state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn
  },
  SET_TARGET (state, target) {
    state.isLoggedIn = false
    state.target = target
  }
}