<style lang="scss">
  .botnet {
    width: 200px;
    .health {
      .background {
        height: 20px;
        background-color: green;
      }
      .label {
        mix-blend-mode: difference;
        position: absolute;
        color: green;
      }
      justify-content: center;
      background-color: black;
      border: 1px green solid;
      height: 20px;
      width: 100%;
    }
    .nodes {
      height: 300px;
      overflow: auto;
      .node {
        &.burned {
          text-decoration: line-through;
        }
      }
    }
  }
</style>
<template lang="pug">
  .botnet
    div(v-if="allNodes.length === 0")
      div No nodes available.
    template(v-else)
      div Available nodes: {{allNodes.length}}
      div ---
      .nodes
        .node(v-for="node in allNodes") {{node}}
</template>
<script>
  import Vuex from 'vuex'
  import WindowDataMixin from './window-data-mixin'

  export default {
    mixins: [WindowDataMixin],
    data () {
      return {
        process: null
      }
    },
    mounted () {
      const foundProcess = this.processes.find(p => p.name === 'botnet')
      if (foundProcess === undefined) {
        const filesToLock = this.storage.files.filter(f => f.type === 'botnet-definition' && f.size === f.loaded).map(f => f.guid)
        this.process = {
          name: 'botnet',
          locks: filesToLock,
          window: this.windowData.guid
        }
        this.addProcess(this.process)
      } else {
        this.process = foundProcess
      }
    },
    destroyed () {
      this.removeProcess(this.process)
    },
    computed: {
      allNodes () {
        return this.storage.files
          .filter(f => f.type === 'botnet-definition' && f.loaded === f.size)
          .map(f => f.metadata.nodes)
          .reduce(((f1, f2) => f1.concat(f2)), [])
      },
      ...Vuex.mapState('localhostModule', ['storage', 'processes'])
    },
    methods: {
      ...Vuex.mapActions('localhostModule', ['addProcess']),
      ...Vuex.mapMutations('localhostModule', {
        removeProcess: 'REMOVE_PROCESS'
      })
    }
  }
</script>

