<style lang="scss">
  .button {
    &:hover {
      border: 1px black solid;
      background: green;
      color: black;
    }
    border: 1px green solid;
    background: black;
    color: green;
  }
</style>

<template lang="pug">
  .connector
    div This is a connector
    a.button(@click="onConnect") Connect
    a.button(@click="onDisconnect") Disconnect
</template>
<script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    computed: {
      ...mapState('targetModule', ['target', 'target2'])
    },
    methods: {
      onConnect () {
        this.setTarget(this.target2)
      },
      onDisconnect() {
        this.setTarget(null)
      },
      ...mapMutations('targetModule', {
        setTarget: 'SET_TARGET'
      })
    }
  }
</script>
