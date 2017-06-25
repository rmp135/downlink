<style lang="scss">
  .login {
    padding: 10px;
    width: 220px;
    .invalid {
      text-align: center;
    }
    input {
      background-color: black;
      color: green;
      border: 1px solid green;
      outline: none;
    }
    .inputs, .labels {
      display: flex;
      justify-content: space-between;
      & > * {
        width: 100px;
      }
    }
    .buttons {
      margin-top: 10px;
      display: flex;
      justify-content: space-around;
    }
  }
</style>
<template lang="pug">
  .login
    .labels
      .label Username
      .password Password
    .inputs
      input(v-model="username", @keypress.enter="onLogin")
      input.password(type="password", v-model="password", @keypress.enter="onLogin")
    .invalid(v-if="isInvalid") Username or password incorrect.
    .buttons
      a.button(@click="onLogin") Login
</template>
<script>
  import { mapActions, mapMutations, mapState } from 'vuex'

  export default {
    data () {
      return {
        username: '',
        password: '',
        isInvalid: false
      }
    },
    computed: {
      ...mapState('targetModule', ['target'])
    },
    watch: {
      target (target) {
        if (target === null) {
          this.$emit('close')
        }
      }
    },
    methods: {
      onLogin () {
        if (this.username !== this.target.credentials.username || this.password !== this.target.credentials.password) {
          this.isInvalid = true
          return
        }
        this.setLoggedIn(true)
        this.$emit('close')
      },
      ...mapMutations('targetModule', {
        setTarget: 'SET_TARGET',
        setLoggedIn: 'SET_IS_LOGGED_IN'
      })
    }
  }
</script>

