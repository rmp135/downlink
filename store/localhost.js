import Vue from 'vue'
import Guid from '~/helpers/guid.js'

export const state = {
  processes: [ ],
  disks: [
    {
      name: 'DISK1',
      capacity: 10,
      files: [ ]
    },
    {
      name: 'DISK2',
      capacity: 20,
      files: [ ]
    },
    {
      name: 'DISK3',
      capacity: 5,
      files: [ ]
    },
  ],
  programs: [
    {
      name: "tracker",
      type: "utilities"
    },
    {
      name: "ping",
      type: "network"
    },
    {
      name: "trace",
      type: "network"
    },
    {
      name: "disk",
      type: "hardware"
    },
    {
      name: "activity-monitor",
      type: "utilities"
    }
  ]
}

export const getters = {
  topProcID (state) {
    if (state.processes.length === 0) return 1
    return state.processes.slice().sort((p1, p2) => p2.id - p1.id)[0].id
  },
  percentProcesses (state, getters) {
    var total = state.processes.map(p => p.priority).reduce(((p1, p2) => p1 + p2), 0)
    return state.processes.map(p => {
      return {
        ...p,
        percent: Math.floor(p.priority / total * 100)
      }
    })
  },
  allFiles (state) {
    return state.disks.map(d => d.files).reduce((f1, f2) => f1.concat(f2))
  }
}

export const actions = {
  createFile ({ state, commit }) {
    const disk = state.disks[0]
    const file = {
      position: 0,
      size: 3,
      percent: 100,
      name: 'test'
    }
    commit('CREATE_FILE', { disk, file })
  },
  deleteFile ({ dispatch }, file) {
    dispatch('addProcess', { name: 'file-delete', metadata: { file: file.guid }})
  },
  copyFile ({ state, commit, dispatch }, { fromFile, to: { disk, file } }) {
    file.percent = 0
    commit('CREATE_FILE', { disk, file })
    dispatch('addProcess', { name: 'file-copy', metadata: { from: fromFile.guid, to: file.guid }})
  },
  addProcess ({ state, commit, getters }, process) {
    process.id = getters.topProcID + 1
    commit('ADD_PROCESS', process)
    return process
  }
}

export const mutations = {
  DELETE_FILE (state, { file, disk }) {
    disk.files.splice(disk.files.indexOf(file), 1)
  },
  CREATE_FILE (state, { file, disk }) {
    file.guid = Guid()
    disk.files.push(file)
  },
  UPDATE_FILE (state, { file, newFile }) {
    Object.assign(file, newFile)
  },
  MOVE_DISK (state, { diskIndex, index }) {
    const disk = state.disks[diskIndex]
    state.disks.splice(diskIndex, 1)
    state.disks.splice(diskIndex, 0, disk)
  },
  ADD_PROCESS (state, process) {
    process.priority = 1
    state.processes.push(process)
  },
  REMOVE_PROCESS (state, process) {
    const procIndex = state.processes.find(p => p.id === process.id)
    if (procIndex != undefined) {
      state.processes.splice(procIndex, 1)
    }
  },
  UPDATE_PROCESS_PRIORITY (state, { id, amount }) {
    const process = state.processes.find(p => p.id === id)
    process.priority = Math.max(process.priority + amount, 0)
  }
}