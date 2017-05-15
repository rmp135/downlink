<template lang="pug">
  #app(@mousemove="onMouseMove")
    window-frame(v-for="(window, index) in windows", :key="index", :window="window")
    program-bar
</template>
<style lang="scss">
  * {
    padding: 0;
    margin: 0;
  }
  html, body, #__nuxt, #app {
    height: 100%;
    user-select: none;
  }
  body {
    background-color: black;
    color: green;
    font-family: monospace;
  }
  #app {
    a:hover {
      background-color: green;
      color: black;
      cursor: pointer;
    }
  }
</style>
<script>
  import { mapMutations, mapState } from 'vuex'
  import ProgramBar from '~components/program-bar'
  import WindowFrame from '~components/window-frame'

  export default {
    computed: {
      ...mapState('windows',
        ['windows']
      )
    },
    methods: {
      onMouseMove (e) {
        this.updateMouse(e)
      },
      ...mapMutations('global', {
        updateMouse: 'UPDATE_MOUSE'
      }),
    },
    components: {
      ProgramBar,
      WindowFrame
    }
  }
</script>