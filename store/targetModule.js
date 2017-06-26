export const state = {
  isLoggedIn: false,
  target: null,
  availableTargets: [
  {
    address: '33.112.3.112',
    credentials: {
      username: 'root',
      password: 'alpine'
    },
    storage: {
      capacity: 20,
      files: [
        {
          name: 'target file',
          guid: '049e08d8-5c76-4fa1-a334-87fdff248a1k',
          size: 3,
          loaded: 3,
          position: 2,
          type: 'document',
          metadata: {
            contents: 'some secret content here'
          }
        }
      ]
    }
  }
  ]
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