import Guid from '~/helpers/guid.js'

export const getters = {
  allFiles (state, getters, rootState) {
    if (rootState.target.target == null) {
      return rootState.localhost.storage.files
    }
    return rootState.target.target.storage.files.concat(rootState.localhost.storage.files)
  },
  fileDiskMap (state, getters, rootState) {
    const getMap = (storage) => storage.files.map(file => { return { storage, file }})
    if (rootState.target.target === null) {
      return getMap(rootState.localhost.storage)
    }
    return getMap(rootState.localhost.storage).concat(getMap(rootState.target.target.storage))
  },
  lockedFiles (state, getters, rootState) {
    return rootState.windows.windows.concat(rootState.localhost.processes).map(s => s.locks).reduce(((l1, l2) => l1.concat(l2)), [])
  }
}

export const actions = {
  beginDeleteProcess ({ dispatch }, file) {
    dispatch('localhost/addProcess', { name: 'file-delete', locks: [file.guid], metadata: { file: file.guid }}, { root: true })
  },
  beginCopyFileProcess ({ state, commit, dispatch }, { fromFile, to: { storage, file } }) {
    file.percent = 0
    commit('CREATE_FILE', { storage, file })
    dispatch('localhost/addProcess', { name: 'file-copy', locks: [file.guid], metadata: { from: fromFile.guid, to: file.guid }}, { root: true })
  },
  openFile ({ dispatch }, file) {
    const newWindow = {
      program: 'file-preview',
      title: file.name,
      locks: [file.guid],
      data: {
        contents: file.metadata.contents
      }
    }
    dispatch('windows/forceAddWindow', newWindow, { root: true })
  }  
}

export const mutations = {
  DELETE_FILE (state, { file, storage }) {
    storage.files.splice(storage.files.indexOf(file), 1)
  },
  CREATE_FILE (state, { file, storage }) {
    file.guid = Guid()
    storage.files.push(file)
  },
  UPDATE_FILE (state, { file, newFile}) {
    Object.assign(file, newFile)
  }
}