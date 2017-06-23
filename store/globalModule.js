export const state = {
  mousePosition: {
    x: 0,
    y: 0
  }
}

export const mutations = {
  UPDATE_MOUSE (state, e) {
    state.mousePosition.x = e.clientX
    state.mousePosition.y = e.clientY
  }
}