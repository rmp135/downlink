<style lang="scss">
  .pauseoverlay {
    position: absolute;
    z-index: 2147483647;
    width: 100%;
    height: 100%;
    .options {
      display: flex;
      height: 100%;
      width: 100%;
      position: absolute;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      z-index: 1;
      font-size: 2rem;
    }
    .background {
      position: absolute;
      height: 100%;
      width: 100%;
      opacity: 0.5;
      background-color: black;
    }
  }
</style>
<template lang="pug">
  .pauseoverlay
    .options
      a(@click="onContinueClick") Continue
      a(@click="onSaveClick") Save
      a(@click="onLoadClick") Load
    .background
</template>
<script>
  import Vuex from 'vuex'

  export default {
    methods: {
      onContinueClick () {
        this.Ticker.start()
        this.setPaused(false)
      },
      onSaveClick () {
        this.storeState()
      },
      onLoadClick () {
        this.restoreState()
      },
      ...Vuex.mapMutations({
        setPaused: 'SET_PAUSED',
      }),
      ...Vuex.mapActions(['storeState', 'restoreState'])
    }
  }
</script>

