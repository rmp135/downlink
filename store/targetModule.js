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
          name: 'botnet definition',
          guid: 'guidd2',
          position: 9,
          size: 1,
          loaded: 1,
          type: 'botnet-definition',
          metadata: {
            burnedNodes: 0,
            nodes: [
              '30.2.25.160',
              '147.248.93.21',
              '29.153.58.210',
              '104.7.102.87',
              '193.230.153.19',
              '65.157.61.136',
              '171.117.136.215'
            ]
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