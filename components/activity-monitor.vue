<style lang="scss">
  .processor {
    width: 200px;
    .process {
      .background {
        height: 15px;
        position: absolute;
        background-color: green;
      }
      .foreground {
        mix-blend-mode: difference;
        background-color: transparent;
        display: flex;
        justify-content: space-around;
      }
      .increase, .decrease, .kill {
        cursor: pointer;
      }
    }
  }
</style>
<template lang="pug">
  .processor
    div(v-if="estimatedProcesses.length === 0") No processes running.
    .process(v-else v-for="process in estimatedProcesses")
      .background(:style="{width: process.percent+'%'}")
      .foreground
        span.decrease(@click="decreasePriority(process.process)") -
        span.name {{process.process.name}}
        span.increase(@click="increasePriority(process.process)") +
        span.kill(@click="killProcess(process.process)") KILL
</template>
<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'

  export default {
    data() {
      return {
        random: 0
      }
    },
    computed: {
      estimatedProcesses () {
        return this.processesWithPercent.map(p => {
          return {
            ...p,
            percent: Math.max(Math.min(Math.floor(p.percent + this.random * Math.random()), 100), 0)
          }
        })
      },
      ...mapState('localhost', ['processes']),
      ...mapGetters('localhost', ['processesWithPercent'])
    },
    mounted () {
      this.randomTimer = setInterval(() => {
        this.random = Math.random()*2 - 4
      }, 100)
    },
    destroyed () {
      clearInterval(this.randomTimer)
    },
    methods: {
      increasePriority (process) {
        this.updateProcessPriority({ process, amount: 1 })
      },
      decreasePriority (process) {
        this.updateProcessPriority({ process, amount: -1 })
      },
      ...mapMutations('localhost', {
        updateProcessPriority: 'UPDATE_PROCESS_PRIORITY',
        killProcess: 'REMOVE_PROCESS'
      })
    }
  }
</script>