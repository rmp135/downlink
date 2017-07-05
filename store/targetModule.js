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
          guid: 'guidd44',
          position: 1,
          size: 1,
          loaded: 1,
          type: 'program',
          metadata: {
            type: 'social'
          }
        },
        {
          name: 'phone',
          guid: 'guidd44',
          position: 9,
          size: 3,
          loaded: 3,
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