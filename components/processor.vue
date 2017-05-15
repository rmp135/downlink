<template lang="pug">
  .processor
    .process(v-for="process in processes") {{process}}
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    computed: {
      ...mapState('localhost', ['processes'])
    }
  }
</script>