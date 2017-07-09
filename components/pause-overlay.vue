<style lang="scss">
  .pauseoverlay {
    position: absolute;
    display: flex;
    align-content: center;
    justify-content: center;
    z-index: 2147483647;
    width: 100%;
    height: 100%;
    .wrapper {
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
    .save-message {
      opacity: 0;
      transition: 1s;
      &.visible {
        opacity: 1;
      }
    }
  }
</style>
<template lang="pug">
  .pauseoverlay
    game-loader(v-if="showLoadGames", @backClick="onBackClick")
    .wrapper(v-else)
      a(@click="onContinueClick") Continue
      a(@click="onSaveClick") Save
      a(@click="onLoadClick") Load
      .save-message(:class="{visible: showSaveMessage}") {{saveMessage}}
    .background
</template>
<script>
  import Vuex from 'vuex'
  import GameLoader from '~components/game-loader'

  export default {
    data: () => ({
      saveMessage: 'Game saved.',
      showSaveMessage: false,
      showLoadGames: false
    }),
    methods: {
      onContinueClick () {
        this.Ticker.start()
        this.setPaused(false)
      },
      onSaveClick () {
        const saveTime = new Date()
        this.saveMessage = `Game ${saveTime.toLocaleDateString()} ${saveTime.toLocaleTimeString()} saved.`
        this.showSaveMessage = true
        setTimeout(() => {
          this.showSaveMessage = false
        }, 1000)
        this.addSaveGame({ saveTime, state: this.$store.state })
      },
      onBackClick () {
        this.showLoadGames = false
      },
      onLoadClick () {
        this.showLoadGames = true
      },
      ...Vuex.mapMutations({
        setPaused: 'SET_PAUSED',
      }),
      ...Vuex.mapActions(['storeState', 'restoreState', 'addSaveGame'])
    },
    components: {
      GameLoader
    }
  }
</script>

