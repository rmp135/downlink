export const state = {
  windows: [
    {
      title: 'some title',
      program: 'disk-manager',
      position: {
        x: 500,
        y: 500
      }
    },
    {
      title: 'some title',
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