import Vue from 'vue'

export const state = {
  credits: 300,
  processes: [ ],
  // processes: [ { id: 1, name: 'test', priority: 1 }, { id:2, name: 'test-2', priority: 2 } ],
  storage:
  {
    name: 'DISK1',
    capacity: 30,
    files: [
      {
        name: 'another file.txt',
        guid: 'guid2',
        position: 0,
        size: 1,
        loaded: 1,
        type: 'document',
        metadata: {
          contents: `This is where the secret information goes.`
        }
      },
      {
        name: 'test file.txt',
        guid: 'guid',
        position: 2,
        size: 6,
        loaded: 6,
        type: 'document',
        metadata: {
          contents: `This is some information. And some more.
          
          More information`
        }
      },
      {
        name: 'botnet definition',
        guid: 'guidd',
        position: 8,
        size: 1,
        loaded: 1,
        type: 'botnet-definition',
        metadata: {
          nodes: [
            '30.2.25.160',
            '147.248.93.21',
            '153.206.229.159',
            '117.175.64.62',
            '33.232.248.206',
            '5.231.75.41',
            '251.107.30.217',
            '215.125.176.20',
            '168.155.56.5',
            '249.51.215.143'
          ]
        }
      }
    ]
  },
  programs: [
    {
      name: 'disk-manager',
      type: 'hardware'
    },
    {
      name: 'activity-monitor',
      type: 'utilities'
    },
    {
      name: 'connector',
      type: 'utilities'
    },
    {
      name: 'messages',
      type: 'communication'
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
    return state.programs.concat(state.storage.files.filter(f => f.type === 'program' && f.loaded === f.size).map(f => ({ name: f.name, type: f.metadata.type }) ))
  }
}

export const actions = {
  addProcess ({ state, commit, getters }, process) {
    process.id = getters.topProcID + 1
    commit('ADD_PROCESS', process)
    return process
  },
  removeProcess ({ state, commit, getters, rootState }, process) {
    const window = rootState.windowsModule.windows.find(w => w.guid === process.window)
    if (window !== undefined) {
      commit('windowsModule/REMOVE_WINDOW', window, { root: true })
    }
    commit('REMOVE_PROCESS', process)
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
  },
  BURN_NODE (state) {
    const definitions = state.storage.files
      .filter(f => f.type === 'botnet-definition' && f.size === f.loaded && f.metadata.nodes.length > 0)
    if (definitions.length === 0) return
    const pickedDefinition = Math.floor(Math.random() * definitions.length)
    const pickedNode = Math.floor(Math.random() * definitions[pickedDefinition].metadata.nodes.length)
    definitions[pickedDefinition].metadata.nodes.splice(pickedNode, 1)
  }
}