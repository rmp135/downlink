<template lang="pug">
  .file-preview
    .contents {{programData.contents}}
</template>
<style lang="scss">
  .file-preview {
    .contents {
      white-space: pre-line;
    }
    width: 200px;
    height: 200px;
    overflow: auto;
    &::-webkit-scrollbar-track
    {
      box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    }

    &::-webkit-scrollbar
    {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb
    {
      background-color: green;
    }
  }
</style>
<script>
import WindowDataMixin from './window-data-mixin'
export default {
  mixins: [WindowDataMixin]
}
</script>
