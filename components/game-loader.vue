<style lang="scss">
  .load-game {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    font-size: 2rem;
    flex-direction: column;
  }
</style>
<template lang="pug">
  .load-game
    a(@click="onBackClick") Back
    .games
      div(v-if="saves.length === 0")
        div No saves found.
      .game(v-for="(save, index) in saves")
        a(@click="onSaveClick(save)") {{save.saveTime | toFriendlyName}}
        a &nbsp;  
        a(@click="onDelClick(index)") DEL

</template>
<script>
  import Vuex from 'vuex'
  import * as store from 'store'

  export default {
    data: () => ({
      saves: []
    }),
    mounted () {
      this.restoreSaves()
    },
    methods: {
      restoreSaves () {
        this.saves = store.get('saves') || []
      },
      onSaveClick (save) {
        this.restoreState(save.state)
      },
      onBackClick () {
        this.$emit('backClick')
      },
      onDelClick (saveIndex) {
        this.deleteSaveGame(saveIndex)
        this.restoreSaves()
      },
      ...Vuex.mapActions(['restoreState', 'deleteSaveGame']),
    },
    filters: {
      toFriendlyName (saveTime) {
        const date = new Date(saveTime)
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
      }
    }
  }
</script>
