<style lang="scss">
  #app {
    height: 100%;
    user-select: none;
    .pause {
      padding: 5px;
      position: absolute;
      &:hover {
        cursor: pointer;
      }
    }
  }
</style>
<template lang="pug">
  #app(@mousemove="onMouseMove")
    div(v-if="isLoading") Loading...
    template(v-else)
      pause-overlay(v-if="isPaused")
      div.pause(@click="onPauseClick")
        span.fa.fa-pause
      window-frame(v-for="(window, index) in windows", :key="index", :window="window")
      program-bar
</template>
<script>
  import { mapMutations, mapState, mapActions } from 'vuex'
  import ProgramBar from '~components/program-bar'
  import WindowFrame from '~components/window-frame'
  import PauseOverlay from '~components/pause-overlay'

  export default {
    data: () => ({
      isLoading: true
    }),
    computed: {
      ...mapState('windowsModule', ['windows']),
      ...mapState(['isPaused'])
    },
    mounted () {
      this.restoreState()
      if (!this.isPaused)
        this.Ticker.start()
      this.isLoading = false
    },
    methods: {
      onMouseMove (e) {
        if (e.which === 1) {
          this.updateMouse(e)
        }
      },
      onPauseClick () {
        this.Ticker.stop()
        this.setPaused(true)
      },
      ...mapMutations({
        updateMouse: 'UPDATE_MOUSE',
        setPaused: 'SET_PAUSED'
      },
      ...mapActions('localhostModule', ['createFile'])),
      ...mapActions(['restoreState'])
    },
    components: {
      ProgramBar,
      WindowFrame,
      PauseOverlay
    }
  }
</script>