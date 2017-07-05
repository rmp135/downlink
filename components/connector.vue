<style lang="scss">
  .connector {
    .lines {
      height: 100px;
      overflow: auto;
    }
  }
</style>

<template lang="pug">
  .connector
    div Enter an address and connect.
    div ---
    div.lines(ref="lines")
      div.line(v-for="line in lines") {{line}}
    input.input(v-model="IPInput", @keydown.enter="onConnect", :disabled="isConnecting || isConnected")
    span.button(:class="{disabled:isConnecting || isConnected}", @click="onConnect") Connect
    span.button(:class="{disabled:isConnecting || !isConnected}", @click="onDisconnect") Disconnect
</template>
<script>
  import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'



  export default {
    data () {
      return {
        IPInput:  '',
        isConnecting: false,
        lines: []
      }
    },
    computed: {
      ...mapState('targetModule', ['target', 'availableTargets']),
      ...mapState('localhostModule', ['processes', 'storage']),
      ...mapGetters('targetModule', ['isConnected'])
    },
    methods: {
      onInput (event) {
        console.log(event.keyCode)
      },
      async addLines (lines) {
        return new Promise(resolve => {
          const _addLines = (lineIndex) => {
            if (lineIndex === lines.length) {
              return resolve()
            }
            this.lines.push(lines[lineIndex])
            setTimeout(_addLines.bind(this, lineIndex + 1), 200)
            this.$nextTick(() => { this.$refs.lines.scrollTop = this.$refs.lines.scrollHeight })
          }
          _addLines(0)
        })
      },
      async onConnect () {
        if (this.isConnecting || this.isConnected) return
        this.isConnecting = true
        const newStatus = [
          'Attempting connection...',
        ]
        const newTarget = this.availableTargets.find(t => t.address === this.IPInput)
        if (newTarget == undefined) {
          newStatus.push('Unable to establish connection.')
          await this.addLines(newStatus)
          this.isConnecting = false
          return
        }
        const proxies = this.storage.files
          .filter(f => f.type === 'botnet-definition')
          .map(f => f.metadata.nodes.slice(f.metadata.burnedNodes, f.metadata.nodes.length))
          .reduce(((f1, f2) => f1.concat(f2)), [])
        if (this.processes.some(p => p.name === 'botnet') && proxies.length > 0) {
          newStatus.push(
            'Proxy network detected.',
            ...proxies.map(p => `Routing through ${p}.`)
          )
        } else {
          newStatus.push(
            'WARNING: Proxy not detected.',
            'Connecting directly...'
          )
        }
        newStatus.push(`Connected to ${newTarget.address}.`)
        await this.addLines(newStatus)
        this.isConnecting = false
        this.setTarget(newTarget)
        this.addWindow({
          title: 'Login',
          program: 'login-box'
        })

        // setInterval(() => {
        //   this.burnNode()
        // }, 2000)
        
      },
      onDisconnect() {
        if (this.isConnecting || !this.isConnected) return
        this.addLines(['Disconnected'])
        this.setTarget(null)
      },
      ...mapMutations('localhostModule', {
        burnNode: 'BURN_NODE'
      }),
      ...mapMutations('targetModule', {
        setTarget: 'SET_TARGET'
      }),
      ...mapActions('windowsModule', ['addWindow'])
    }
  }
</script>
