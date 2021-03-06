<style lang="scss">
  .disk-manager {
    width: 20rem;
    .disks {
      display: flex;
      & > * {
        flex-grow: 1;
        flex-basis: 0;
      }
    }
    .target {
      margin-left: 0.5rem;
      .no-target-wrapper {
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }
    }
    .files {
      position: relative;
      .file {
        position: absolute;
        width: 100%;
        background: black;
        border-bottom: green solid 1px;
        .background {
          height: 100%;
          background: green;
        }
        .name {
          cursor: default;
          mix-blend-mode: difference;
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          color: green;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .slot {
      box-sizing: border-box;
      border-bottom: green solid 1px;
      height: 1rem;
    }
    .action {
      cursor: pointer;
      &.disabled {
        color:  darken(green, 10);
        cursor: not-allowed;
      }
    }
  }
</style>
<template lang="pug">
  .disk-manager
    .commands
      span.action(:class="{disabled:!canDeleteFile(selectedFile)}" @click="attemptDeleteFile(selectedFile)") DEL
      span |
      span.action(:class="{disabled:!canOpenFile(selectedFile)}" @click="attemptOpenFile(selectedFile)") OPEN
      span |
      span.action(:class="{disabled:!canTransferFile(selectedFile)}" @click="attemptTransferFile(selectedFile)") TRANS
    .disks
      .localhost
        .files
          .file(v-for="file in storage.files", :style="{height:file.size+'rem', top:file.position+'rem'}", @click="selectFile(file, storage)")
            .name
              span(v-if="selectedFile === file") &#10004;
              span {{file.name}}
            .background(:style="{width:file.loaded / file.size * 100+'%'}")
        .slots  
          .slot(v-for="i in storage.capacity")
      .target
        .no-target-wrapper(v-if="!isConnected")
          span Not connected to a remote host.
        .no-target-wrapper(v-else-if="!isLoggedIn")
          span Not logged in to remote host.
        .wrapper(v-else)
          .files
            .file(v-for="file in targetStorage.files", :style="{height:file.size+'rem', top:file.position+'rem'}", @click="selectFile(file, targetStorage)")
              .name
                span(v-if="selectedFile === file") &#10004;
                span {{file.name}}
              .background(:style="{width:file.loaded / file.size * 100+'%'}")
          .slots  
            .slot(v-for="i in targetStorage.capacity")

</template>
<script>
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
  import cloneDeep from 'lodash/cloneDeep'
  
  export default {
    data () {
      return {
        selectedFile: null,
        selectedDisk: null
      }
    },
    watch: {
      targetStorage (targetStorage, oldTargetStorage) {
        if (this.selectedDisk ===oldTargetStorage && targetStorage === null) {
          this.selectedDisk = null
          this.selectedFile = null
        }
      }
    },
    computed: {
      ...mapState('localhostModule', ['storage']),
      ...mapState('targetModule', {
        targetStorage: (state) => state.target !==  null ? state.target.storage : null
      }),
      ...mapGetters('filesystemModule', ['allFiles', 'fileDiskMap', 'lockedFiles']),
      ...mapGetters('localhostModule', ['processesWithPercent']),
      ...mapGetters('targetModule', ['isConnected', 'isLoggedIn'])
    },
    mounted () {
      this.Ticker.add(this.process, 100)
    },
    destroyed () {
      this.Ticker.remove(this.process)
    },
    methods: {
      process () {
        const toRemove = []
        for (let processWrapper of this.processesWithPercent) {
          const process = processWrapper.process
          if (processWrapper.percent === 0) continue
          switch (process.name) {
            case 'file-copy': {
              const file = this.allFiles.find(f => f.guid === process.metadata.to)
              const fromFile = this.allFiles.find(f => f.guid === process.metadata.from)
              if (file === undefined
                || file.loaded === file.size
                || fromFile === undefined
                || fromFile.loaded < fromFile.size
                || !this.allFiles.find(f => f.guid === process.metadata.from)) {
                toRemove.push(process)
                break
              }
              this.updateFile({ file, newFile: { ...file, loaded: Math.min(file.loaded += 0.03 * processWrapper.percent / 100, file.size) } })
              break
            }
            case 'file-delete': {
              const map = this.fileDiskMap.find(f => f.file.guid === process.metadata.file)
              if (map === undefined) {
                toRemove.push(process)
                break
              }
              const { file, storage } = map
              if (file.loaded <= 0) {
                toRemove.push(process)
                this.commitDeleteFile({ storage, file })
                if (this.selectedFile == file) {
                  this.selectedDisk = null
                  this.selectedFile = null
                }
                break
              }
              this.updateFile({ file, newFile: { ...file, percent: file.loaded -= 0.05 * processWrapper.percent / 100 } })
              break
            }
          }
        }
        for (let process of toRemove) {
          this.removeProcess(process)
        }
      },
      gapsInStorage (storage) {
        const newFiles = storage.files.slice()
        newFiles.push({ position: 0, size: 0, placeholder: true })
        return newFiles
        .sort((f1, f2) => (f1.position > f2.position || (!f1.placeholder && f2.placeholder)) ? 1 : -1)
        .map((f, index) => {
          let gap = 0
          if (index === newFiles.length - 1) {
            gap = storage.capacity - f.position - f.size
          } else {
            gap = newFiles[index+1].position - f.position - f.size
          }
          return { position: f.position + f.size, size: gap }
        })
        .filter(f => f.size > 0)
      },
      canDeleteFile (file) {
        if (file === null) return false
        return !this.lockedFiles.includes(file.guid)
      },
      canTransferFile (file) {
        if (file === null || file.loaded < file.size || !this.isLoggedIn) return false
        const storage = this.selectedDisk === this.storage ? this.targetStorage : this.storage
        return this.gapsInStorage(storage).some(f => f.size >= file.size)
      },
      async transferFile (file, storage) {
        if (!this.canTransferFile(file)) return
        const gaps = this.gapsInStorage(storage)
        const newFile = cloneDeep(file)
        newFile.position = gaps.find(g => g.size >= file.size).position
        this.beginCopyFileProcess({ fromFile: file, to: { storage, file: newFile }})
      },
      selectFile (file, disk) {
        if (file === this.selectedFile) {
          this.selectedFile = null
          this.selectedDisk = null
          return
        } 
        this.selectedFile = file
        this.selectedDisk = disk
      },
      canOpenFile (file) {
        return file !== null && file.loaded == file.size
      },
      attemptOpenFile (file) {
        if (!this.canOpenFile(file)) return
        this.openFile(file)
      },
      attemptDeleteFile (file) {
        if (!this.canDeleteFile(file)) return
        this.beginDeleteProcess(file)
      },
      attemptTransferFile (file) {
        const storage = this.selectedDisk === this.storage ? this.targetStorage : this.storage
        if (file == null || storage == null) return
        this.transferFile(file, storage)
      },
      ...mapActions('filesystemModule', ['beginDeleteProcess', 'beginCopyFileProcess', 'openFile']),
      ...mapMutations('filesystemModule', {
        commitDeleteFile: 'DELETE_FILE',
        createFile: 'CREATE_FILE',
        updateFile: 'UPDATE_FILE'
      }),
      ...mapMutations('localhostModule', {
        removeProcess: 'REMOVE_PROCESS'
      })
    }
  }
</script>