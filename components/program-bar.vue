<style lang="scss">
  #program-bar {
    width: 500px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    .programs-list {
      &.hidden {
        visibility: hidden;
      }
    }
    .program-group {
      display: inline-block;
    }
  }
</style>
<template lang="pug">
  #program-bar
    .program-group(v-for="(value, key, index) in groupedPrograms", @mouseout.stop="onMouseOut") 
      .programs-list(:class="{hidden: index !== activeMenu}")
        .program(v-for="program in value")
          a(@click="onClick(program)") {{program.name}}
      .title(@mouseover="onMouseOver(index)")
        a {{key}}
</template>
<script>
  import Vuex from 'vuex'

  export default {
    data () {
      return {
        activeMenu: null
      }
    },
    computed: {
      groupedPrograms () {
        const programs = {}
        for (let p of this.allPrograms) {
          if (!programs[p.type]) {
            programs[p.type] = []
          }
          programs[p.type].push(p)
        }
        return programs
      },
      ...Vuex.mapGetters('localhostModule', ['allPrograms'])
    },
    methods: {
      onMouseOver (index) {
        this.activeMenu = index
      },
      onMouseOut (e) {
        if (e.toElement === null || e.toElement.id === 'app') {
          this.activeMenu = null
        }
      },
      onClick (program) {
        const window = {
          program: program.name,
          title: program.title
        }
        if (program.file) {
          window.locks = [program.file]
        }
        this.addWindow(window)
      },
      ...Vuex.mapActions('windowsModule', ['addWindow'])
    }
  }
</script>