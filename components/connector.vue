<style lang="scss">
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
</style>

<template lang="pug">
  .connector
    div This is a connector
    span.button(:class="{disabled:isConnected}", @click="onConnect") Connect
    span.button(:class="{disabled:!isConnected}", @click="onDisconnect") Disconnect
</template>
<script>
  import { mapMutations, mapState, mapActions, mapGetters } from 'vuex'

  const newTarget = {
    credentials: {
      username: 'root',
      password: 'alpine'
    },
    storage: {
      capacity: 20,
      files: [
        {
          name: 'target file',
          guid: '049e08d8-5c76-4fa1-a334-87fdff248a1k',
          size: 3,
          loaded: 3,
          position: 2,
          type: 'document',
          metadata: {
            contents: 'some secret content here'
          }
        }
      ]
    }
  }

  export default {
    computed: {
      ...mapState('targetModule', ['target']),
      ...mapGetters('targetModule', ['isConnected'])
    },
    methods: {
      onConnect () {
        if (this.isConnected) return
        this.setTarget(newTarget)
        this.addWindow({
          title: 'Login',
          program: 'login-box'
        })
      },
      onDisconnect() {
        this.setTarget(null)
      },
      ...mapMutations('targetModule', {
        setTarget: 'SET_TARGET'
      }),
      ...mapActions('windowsModule', ['addWindow'])
    }
  }
</script>
