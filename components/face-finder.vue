<style lang="scss">

</style>
<template lang="pug">
  .face-finder
    div Person to find:
    input
    .button Search
    div ---
    .details No details found.
</template>
<script>
  import Vuex from 'vuex'
  export default {
    computed: {
      ...Vuex.mapState('targetModule', 'availableTargets')
    }
  }
</script>
