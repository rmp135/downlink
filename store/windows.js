export const state = {
  windows: [
    {
      title: 'Disk Manager',
      program: 'disk-manager',
      index: 0,
      position: {
        x: 200,
        y: 200
      }
    },
    {
      title: 'Activity Monitor',
      program: 'activity-monitor',
      index: 1,
      position: {
        x: 100,
        y: 100
      }
    }
  ]
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
  }
}