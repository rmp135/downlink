import createGUID from '~/helpers/createGUID.js'

export const getters = {
  allFiles (state, getters, rootState) {
    if (rootState.targetModule.target == null) {
      return rootState.localhostModule.storage.files
    }
    return rootState.targetModule.target.storage.files.concat(rootState.localhostModule.storage.files)
  },
  fileDiskMap (state, getters, rootState) {
    const getMap = (storage) => storage.files.map(file => { return { storage, file }})
    if (rootState.targetModule.target === null) {
      return getMap(rootState.localhostModule.storage)
    }
    return getMap(rootState.localhostModule.storage).concat(getMap(rootState.targetModule.target.storage))
  },
  lockedFiles (state, getters, rootState) {
    return rootState.windowsModule.windows.concat(rootState.localhostModule.processes).map(s => s.locks).reduce(((l1, l2) => l1.concat(l2)), [])
  }
}

export const actions = {
  beginDeleteProcess ({ dispatch }, file) {
    dispatch('localhostModule/addProcess', { name: 'file-delete', locks: [file.guid], metadata: { file: file.guid }}, { root: true })
  },
  beginCopyFileProcess ({ state, commit, dispatch }, { fromFile, to: { storage, file } }) {
    file.loaded = 0
    commit('CREATE_FILE', { storage, file })
    dispatch('localhostModule/addProcess', { name: 'file-copy', locks: [file.guid], metadata: { from: fromFile.guid, to: file.guid }}, { root: true })
  },
  openFile ({ dispatch }, file) {
    const newWindow = {
      program: 'file-preview',
      title: file.name,
      locks: [file.guid],
      data: file
    }
    dispatch('windowsModule/forceAddWindow', newWindow, { root: true })
  }  
}

export const mutations = {
  DELETE_FILE (state, { file, storage }) {
    storage.files.splice(storage.files.indexOf(file), 1)
  },
  CREATE_FILE (state, { file, storage }) {
    file.guid = createGUID()
    storage.files.push(file)
  },
  UPDATE_FILE (state, { file, newFile}) {
    Object.assign(file, newFile)
  }
}