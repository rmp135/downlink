import createGUID from '~/helpers/createGUID.js'

export const state = {
  windows: [
    {
      title: 'Messages',
      program: 'messages',
      guid: 'bfd89f5e-67a0-477e-84cb-2066cb5ba393',
      index: 0,
      locks: [],
      position: {
        x: 200,
        y: 200
      }
    },
    // {
    //   title: 'Face Finder',
    //   program: 'face-finder',
    //   guid: 'bfd89f5e-67a0-477e-84cb-2066cb5ba393',
    //   index: 0,
    //   locks: [],
    //   position: {
    //     x: 200,
    //     y: 200
    //   }
    // },
    // {
    //   title: 'Login',
    //   program: 'login-box',
    //   index: 0,
    //   locks: [],
    //   position: {
    //     x: 200,
    //     y: 200
    //   }
    // },
    // {
    //   title: 'Activity Monitor',
    //   program: 'activity-monitor',
    //   guid: 'c7db40e8-b0b3-4ebd-9186-f0b03964a0e2',
    //   index: 1,
    //   locks: [],
    //   position: {
    //     x: 0,
    //     y: 0
    //   }
    // },
    // {
    //   title: 'Connector',
    //   program: 'connector',
    //   guid: '9a86f98f-52a1-4334-9888-e04f14eeb515',
    //   index: 2,
    //   locks: [],
    //   position: {
    //     x: 100,
    //     y: 100
    //   }
    // },
    // {
    //   title: 'Bot Net',
    //   program: 'bot-net',
    //   guid: '9a86f98f-52a1-4334-9888-e04f14eeb516',
    //   index: 2,
    //   locks: ['guidd'],
    //   position: {
    //     x: 100,
    //     y: 100
    //   }
    // }
  ]
}

export const actions = {
  forceAddWindow ({ commit }, window) {
    window = {
      title: 'Untitled Window',
      guid: createGUID(),
      index: 0,
      data: { },
      locks: [],
      position: {
        x: innerWidth / 4,
        y: innerHeight / 4
      },
      ...window
    }
    commit('ADD_WINDOW', window)
    commit('SET_TOP_WINDOW', window)
  },
  addWindow ({ state, commit, dispatch }, window) {
    const openWindow = state.windows.find(w => w.program === window.program)
    if (openWindow !== undefined) {
      commit('SET_TOP_WINDOW', window)
      return
    }
    dispatch('forceAddWindow', window)
  }
}

export const mutations = {
  SET_TOP_WINDOW (state, window) {
    window.index = state.windows.map(w => w.index).reduce(((i1, i2) => i1 > i2 ? i1 : i2), 0) + 1
  },
  UPDATE_WINDOW (state, { window, newWindow }) {
    Object.assign(window, newWindow)
  },
  REMOVE_WINDOW (state, window) {
    state.windows.splice(state.windows.indexOf(window), 1)
  },
  ADD_WINDOW (state, window) {
    state.windows.push(window)
  }
}