export const state = {
  isLoggedIn: false,
  target: null,
  availableTargets: [{
    address: '332.112.3.112',
    credentials: {
      username: 'root',
      password: 'alpine'
    },
    storage: {
      capacity: 20,
      files: [
        {
          name: 'face-finder',
          guid: '​​​​​0e44f523-03e0-4e3d-be5a-1c25edba9d61​​​​​',
          position: 1,
          size: 1,
          loaded: 1,
          type: 'program',
          metadata: {
            type: 'social'
          }
        }
      ]
    }
  }]
}

export const getters = {
  isConnected (state) {
    return state.target !== null
  },
  isLoggedIn (state, getters) {
    return getters.isConnected && state.isLoggedIn
  },
  allUsers (state) {
    return state.availableTargets.map(s => s.user).filter(u => u !== undefined)
  }
}

export const mutations = {
  SET_IS_LOGGED_IN (state, isLoggedIn) {
    state.isLoggedIn = isLoggedIn
  },
  SET_TARGET (state, target) {
    state.isLoggedIn = false
    state.target = target
  },
  ADD_TARGET (state, target) {
    state.availableTargets.push(target)
  }
}