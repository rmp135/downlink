import Vue from 'vue'

export const state = {
  processes: [
    {
      id: 1,
      name: 'something',
      percent: 100
    }
  ],
  disks: [
    {
      name: 'DISK1',
      capacity: 10,
      files: [
        {
          position:1,
          size: 2,
          name: 'other',
          percent: 60
        },
        {
          position: 3,
          size: 4,
          name: 'something',
          percent: 100
        }
      ]
    },
    {
      name: 'DISK2',
      capacity: 20,
      files: [
        {
          position: 2,
          size: 14,
          name: 'something',
          percent: 100
        }
      ]
    },
    {
      name: 'DISK3',
      capacity: 5,
      files: [
        {
          position: 0,
          size: 1,
          name: 'something',
          percent: 40
        }
      ]
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
  }
}

export const actions = {
  async copyFile ({ state, commit, dispatch }, { disk, file }) {
    file.percent = 0
    commit('CREATE_FILE', { disk, file })
    const process = await dispatch('addProcess', { name: 'copy-file' })
    function proc () {
      file.percent = file.percent + 1
      if (file.percent < 100) {
        setTimeout(proc.bind(this), 10 / 100 * process.percent)
      } else {
        commit('REMOVE_PROCESS', process)
      }
    }
    proc.call(this)
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
    process.percent = Math.floor(100 / (state.processes.length + 1))
    state.processes.forEach(p => p.percent = Math.floor(p.percent / 100 * (100 - process.percent)))
    state.processes.push(process)
  },
  REMOVE_PROCESS (state, process) {
    state.processes.splice(state.processes.indexOf(process), 1)
    state.processes.forEach(p => p.percent = Math.floor(p.percent / 100))
  }
}