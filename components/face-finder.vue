<style lang="scss">
  .face-finder {
    width: 300px;
  }
</style>
<template lang="pug">
  .face-finder
    div Person to find:
    input(v-model="searchName", @keypress.enter="onSearchClick")
    .button(@click="onSearchClick") Search
    div ---
    .details(v-if="currentUser == null") No details found.
    .details(v-else)
      div Name: {{currentUser.name | notBlank}}
      div Handle:  {{currentUser.social.username | notBlank}}
      div Last Updates: 
      div(v-for="update in currentUser.social.updates") {{update}}
</template>
<script>
  import Vuex from 'vuex'
  export default {
    data: () => ({
      searchName: '',
      currentUser: null
    }),
    filters: {
      notBlank (text) {
        return text == null ? 'Unknown.' : text
      }
    },
    computed: {
      ...Vuex.mapGetters('targetModule', ['allUsers'])
    },
    methods: {
      onSearchClick () {
        this.currentUser = this.allUsers.find(u => u.name.toLowerCase() === this.searchName.toLowerCase())
      }
    }
  }
</script>
