import Vue from 'vue'
import Guid from '~/helpers/guid.js'

export const state = {
  processes: [ ],
  // processes: [ { id: 1, name: 'test', priority: 1 }, { id:2, name: 'test-2', priority: 2 } ],
  disks: [
    {
      name: 'DISK1',
      capacity: 10,
      files: [
        {
          name: 'test file',
          position: 0,
          size: 1,
          percent: 100, //TODO: Change this from percent to transferred.
          type: 'document',
          metadata: {
            contents: `This is some information. And some more.
            
            More information`
          }
        }
      ]
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
      name: "disk-manager",
      type: "hardware"
    },
    {
      name: "activity-monitor",
      type: "utilities"
    }
  ]
}

export const getters = {
  lockedFiles (state) {
    return state.processes.map(s => s.locks).reduce(((l1, l2) => l1.concat(l2)), [])
  },
  processesWithPercent (state) {
    var total = state.processes.map(p => p.priority).reduce(((p1, p2) => p1 + p2), 0)
    const asPercent = (process) => {
      return process.priority === 0 ? 0 : Math.floor(process.priority / total * 100)
    }
    return state.processes.map(p => {
      return {
        process: p,
        percent: Math.max(Math.min(Math.floor(asPercent(p)), 100), 0)
      }
    })
  },
  topProcID (state) {
    if (state.processes.length === 0) return 1
    return state.processes.slice().sort((p1, p2) => p2.id - p1.id)[0].id
  }, 
  allFiles (state) {
    return state.disks.map(d => d.files).reduce((f1, f2) => f1.concat(f2))
  },
  allPrograms (state, getters) {
    return state.programs.concat(getters.allFiles.filter(f => f.type === 'program').map(f => ({ name: f.name, type: f.metadata.type }) ))
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
    dispatch('addProcess', { name: 'file-delete', locks: [file.guid], metadata: { file: file.guid }})
  },
  copyFile ({ state, commit, dispatch }, { fromFile, to: { disk, file } }) {
    file.percent = 0
    commit('CREATE_FILE', { disk, file })
    dispatch('addProcess', { name: 'file-copy', locks: [file.guid], metadata: { from: fromFile.guid, to: file.guid }})
  },
  addProcess ({ state, commit, getters }, process) {
    process.id = getters.topProcID + 1
    commit('ADD_PROCESS', process)
    return process
  },
  openFile ({ dispatch }, file) {
    const newWindow = {
      program: 'file-preview',
      title: file.name,
      data: {
        contents: file.metadata.contents
      }
    }
    dispatch('windows/forceAddWindow', newWindow, { root: true })
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
    const procIndex = state.processes.indexOf(process)
    if (procIndex != -1) {
      state.processes.splice(procIndex, 1)
    }
  },
  UPDATE_PROCESS_PRIORITY (state, { process, amount }) {
    process.priority = Math.max(process.priority + amount, 0)
  }
}