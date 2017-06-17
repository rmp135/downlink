export const state = {
  windows: [
    {
      title: 'Disk Manager',
      program: 'disk-manager',
      position: {
        x: 200,
        y: 200
      }
    },
    {
      title: 'Processor',
      program: 'processor',
      position: {
        x: 100,
        y: 100
      }
    }
  ]
}

export const mutations = {
  UPDATE_WINDOW (state, { window, newWindow }) {
    Object.assign(window, newWindow)
  },
  REMOVE_WINDOW (state, window) {
    state.windows.splice(state.windows.indexOf(window), 1)
  }
}