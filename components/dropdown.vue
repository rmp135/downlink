<style lang="scss">
  .dropdown {
    position: relative;
    &:hover {
      .options {
        display: block;
      }
    }
    .options {
      display: none;
      box-sizing: border-box;
      position: absolute;
      width: 100%;
      background: black;
      border: 1px green solid;
      padding: 5px;
      .option:hover {
        cursor: pointer;
        background-color: green;
        color: black;
      }
    }
    .picked {
      align-items: center;
      display: flex;
      height: 1rem;
      border: 1px green solid;
      &:hover {
        background-color: green;
        color: black;
      }
    }
  }
</style>
<template lang="pug">
  .dropdown
    .picked {{picked}}
    .options
      .option(v-for="option in options", @click="onSelect(option)") {{option}}
</template>
<script>
  export default {
    props: {
      options: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      picked: ''
    }),
    mounted () {
      this.picked = this.options[0]
    },
    methods: {
      onSelect (picked) {
        this.picked = picked
        this.$emit('input', this.picked)
      }
    }
  }
</script>
