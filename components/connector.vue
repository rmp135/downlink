<style lang="scss">
  .connector {
    ::-webkit-scrollbar-track
    {
      box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }

    ::-webkit-scrollbar
    {
      width: 6px;
    }

    ::-webkit-scrollbar-thumb
    {
      background-color: green;
    }

    .lines {
      height: 100px;
      overflow: auto;
    }
    input {
      display: block;
      background-color: black;
      color: green;
      outline: none;
      border: 1px green solid;
      &:disabled {
        color: darken(green, 10);
      }
    }
    .button {
      &:hover {
        border: 1px black solid;
        background: green;
        color: black;
        cursor: pointer;
      }
      &.disabled, &.disabled:hover {
        background: black;
        color:  darken(green, 10);
        border-color: darken(green, 10);
        cursor: not-allowed;
      }
      border: 1px green solid;
      background: black;
      color: green;
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
        if (false) {
          newStatus.push(
            'Proxy network detected.',
            'Routing through 223.2.2.11',
            'Routing through 32.1.23.2',
            'Routing through 99.11.2.112',
            'Routing through 223.2.2.11',
            'Routing through 223.2.2.14'
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
      },
      onDisconnect() {
        if (this.isConnecting || !this.isConnected) return
        this.addLines(['Disconnected'])
        this.setTarget(null)
      },
      ...mapMutations('targetModule', {
        setTarget: 'SET_TARGET'
      }),
      ...mapActions('windowsModule', ['addWindow'])
    }
  }
</script>
