export const state = {
  target: {
    storage: {
      capacity: 20,
      files: [
        {
          name: 'target file',
          guid: '049e08d8-5c76-4fa1-a334-87fdff248a1k',
          size: 3,
          position: 2,
          percent: 100
        }
      ]
    }
  }
}

export const mutations = {
  SET_TARGET (state, target) {
    state.target = target
  }
}