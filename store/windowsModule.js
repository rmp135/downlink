export const state = {
  windows: [
    {
      title: 'Disk Manager',
      program: 'disk-manager',
      index: 0,
      locks: [],
      position: {
        x: 200,
        y: 200
      }
    },
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
    {
      title: 'Activity Monitor',
      program: 'activity-monitor',
      index: 1,
      locks: [],
      position: {
        x: 0,
        y: 0
      }
    },
    {
      title: 'Connector',
      program: 'connector',
      index: 2,
      locks: [],
      position: {
        x: 100,
        y: 100
      }
    }
  ]
}

export const actions = {
  forceAddWindow ({ commit }, window) {
    debugger
    window = {
      title: 'Untitled Window',
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