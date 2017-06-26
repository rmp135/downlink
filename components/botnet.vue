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
      &::-webkit-scrollbar-track
      {
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      }

      &::-webkit-scrollbar
      {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb
      {
        background-color: green;
      }
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
    div(v-if="definitions.length === 0")
      div No botnets found.
    template(v-else)
      div.health
        .label Health
        .background(:style="{width:health+'%'}")
      div ---
      div Total nodes: {{allNodes.nodes.length}}
      div Available nodes: {{allNodes.nodes.length - allNodes.burnedNodes}}
      div ---
      .nodes
        div(v-for="definition in definitions")
          div.node(v-for="(node, index) in definition.nodes", :class="{burned: index < definition.burnedNodes}") {{node}}
</template>
<script>
  import Vuex from 'vuex'

  export default {
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
          locks: filesToLock
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
      definitions () {
        return this.storage.files
          .filter(f => f.type === 'botnet-definition' && f.loaded === f.size)
          .map(f => f.metadata)
      },
      allNodes () {
        return this.definitions.reduce((f1, f2) => ({ burnedNodes: f1.burnedNodes + f2.burnedNodes, nodes: f1.nodes.concat(f2.nodes) }), { burnedNodes: 0, nodes: [] })
      },
      health () {
        if (this.allNodes.nodes.length === 0) return 0
        return Math.floor(100 - this.allNodes.burnedNodes / this.allNodes.nodes.length * 100)
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

