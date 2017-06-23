import Vue from 'vue'

export const state = {
  processes: [ ],
  // processes: [ { id: 1, name: 'test', priority: 1 }, { id:2, name: 'test-2', priority: 2 } ],
  storage:
  {
    name: 'DISK1',
    capacity: 30,
    files: [
      {
        name: 'another file',
        guid: 'guid2',
        position: 0,
        size: 1,
        percent: 100, //TODO: Change this from percent to transferred.
        type: 'document',
        metadata: {
          contents: `This is some information. And some more.
          
          More information`
        }
      },
      {
        name: 'test file',
        guid: 'guid',
        position: 2,
        size: 6,
        percent: 20, //TODO: Change this from percent to transferred.
        type: 'document',
        metadata: {
          contents: `This is some information. And some more.
          
          More information`
        }
      }
    ]
  },
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
  allPrograms (state, getters) {
    return state.programs.concat(state.storage.files.filter(f => f.type === 'program').map(f => ({ name: f.name, type: f.metadata.type }) ))
  }
}

export const actions = {
  addProcess ({ state, commit, getters }, process) {
    process.id = getters.topProcID + 1
    commit('ADD_PROCESS', process)
    return process
  }
}

export const mutations = {
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