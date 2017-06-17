<template lang="pug">
  .disk-manager
    .disk(v-for="(disk, index) in disks")
      span {{disk.name}}
      span.files
        span.file(v-for="file in disk.files", :style="{width:file.size+'rem', left:file.position+'rem'}", @click="selectFile(file, disk)")
          span.selected(v-show="file === selectedFile") X
          span.loading(:style="{width:file.percent+'%'}")
          span.background(:style="{width:100-file.percent+'%'}")
      span.slots
        span.slot(v-for="i in disk.capacity")
      .info(v-if="disk === selectedDisk")
        span {{selectedFile.name}} | 
        span.action(:class="{disabled:!canDeleteFile(selectedFile)}" @click="onFileDeleteClick(selectedFile, disk)") DEL
        span  | 
        span.action(:class="{disabled:!canMoveUp(selectedFile, index)}", @click="copyUp(selectedFile, index)") CPYUP
        span  | 
        span.action(:class="{disabled:!canMoveDown(selectedFile, index)}", @click="copyDown(selectedFile, index)") CPYDWN
        span  | 
        span.action(@click="openFile(selectedFile)") OPEN
</template>
<style lang="scss">
  .disk-manager {
    .disk {
      .files {
        position: absolute;
        .file {
          .loading {
            background-color: green;
            width: 100%;
            height: inherit;
          }
          .background {
            width: 100%;
            height: inherit;
            background-color: black;
            border: 1px solid green;
            box-sizing: border-box;
          }
          .selected {
            color: green;
            mix-blend-mode: difference;
            position: absolute;
          }
          cursor: pointer;
          position: absolute;
          display: flex;
          justify-content: center;
          align-items: center;
          color: black;
          border-left: 1px solid black;
          border-right: 1px solid black;
        }
      }
      .file, .slot {
        display: inline-block;
        box-sizing: border-box;
        height: 1rem;
      }
      .slot {
        border: 1px solid green;
        width: 1rem;
      }
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
    computed: {
      ...mapState('localhost', ['disks']),
      ...mapGetters('localhost', ['allFiles', 'processesWithPercent', 'lockedFiles'])
    },
    mounted () {
      setInterval(this.process, 100)
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
              if (file === undefined  || file.percent === 100 || fromFile.percent < 100 || !this.allFiles.find(f => f.guid === process.metadata.from)) {
                toRemove.push(process)
                break
              }
              this.updateFile({ file, newFile: { ...file, percent: Math.min(file.percent += 3 * processWrapper.percent / 100, 100) } })
              break
            }
            case 'file-delete': {
              const file = this.allFiles.find(f => f.guid === process.metadata.file)
              if (file === undefined || file.percent <= 0) {
                toRemove.push(process)
                if (file.percent <= 0) {
                  this.commitDeleteFile({ disk: this.disks.find(d => d.files.includes(file)) , file })
                  if (this.selectedFile == file) {
                    this.selectedDisk = null
                    this.selectedFile = null
                  }
                }
                break
              }
              this.updateFile({ file, newFile: { ...file, percent: file.percent -= 5 * processWrapper.percent / 100 } })
              break
            }
          }
        }
        for (let process of toRemove) {
          this.removeProcess(process)
        }
      },
      gapsInDisk (disk) {
        const newFiles = disk.files.slice()
        newFiles.push({ position: 0, size: 0, placeholder: true })
        return newFiles
        .sort((f1, f2) => (f1.position > f2.position || (!f1.placeholder && f2.placeholder)) ? 1 : -1)
        .map((f, index) => {
          let gap = 0
          if (index === newFiles.length - 1) {
            gap = disk.capacity - f.position - f.size
          } else {
            gap = newFiles[index+1].position - f.position - f.size
          }
          return { position: f.position + f.size, size: gap }
        })
        .filter(f => f.size > 0)
      },
      canDeleteFile (file) {
        return !this.lockedFiles.includes(file.guid)
      },
      canHoldFile (file, disk) {
        return this.gapsInDisk(disk).some(f => f.size >= file.size)
      },
      canMoveFile (file) {
        return file.percent === 100
      },
      canMoveUp (file, diskIndex) {
        if (diskIndex === 0 || !this.canMoveFile(file)) return false
        return this.canHoldFile(file, this.disks[diskIndex-1])
      },
      canMoveDown (file, diskIndex) {
        if (diskIndex === this.disks.length - 1 || !this.canMoveFile(file)) return false
        return this.canHoldFile(file, this.disks[diskIndex+1])
      },
      async copyDown (file, diskIndex) {
        if (!this.canMoveDown(file, diskIndex)) return
        const gaps = this.gapsInDisk(this.disks[diskIndex + 1])
        const newFile = cloneDeep(file)
        newFile.position = gaps.find(g => g.size >= file.size).position
        this.copyFile({ fromFile: file, to: { disk: this.disks[diskIndex + 1], file: newFile }})
      },
      copyUp (file, diskIndex) {
        if (!this.canMoveUp(file, diskIndex)) return
        const gaps = this.gapsInDisk(this.disks[diskIndex - 1])
        const newFile = cloneDeep(file)
        newFile.position = gaps.find(g => g.size >= file.size).position
        this.copyFile({ fromFile: file, to: { disk: this.disks[diskIndex - 1], file: newFile }})
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
      onFileDeleteClick (file, disk) {
        this.deleteFile(file)
      },
      ...mapActions('localhost', ['copyFile', 'deleteFile', 'openFile']),
      ...mapMutations('localhost', {
        createFile: 'CREATE_FILE',
        moveDisk: 'MOVE_DISK',
        removeProcess: 'REMOVE_PROCESS',
        updateFile: 'UPDATE_FILE',
        commitDeleteFile: 'DELETE_FILE'
      })
    }
  }
</script>