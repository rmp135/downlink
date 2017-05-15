<template lang="pug">
  #program-bar
    .program-group(v-for="(value, key) in groupedPrograms") 
      .programs-list
        .program(v-for="program in value")
          a {{program.name}}
      .title
        a {{key}}
</template>
<style lang="scss">
  #program-bar {
    position: absolute;
    bottom: 0;
    .program-group {
      display: inline-block;
    }
  }
</style>
<script>
  import Vuex from 'vuex'

  export default {
    computed: {
      groupedPrograms () {
        const programs = {}
        for (let p of this.programs) {
          if (!programs[p.type]) {
            programs[p.type] = []
          }
          programs[p.type].push(p)
        }
        return programs
      },
      ...Vuex.mapState('localhost',['programs'])
    }
  }
</script>