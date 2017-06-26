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
<template lang="pug">
  .file-preview
    .contents {{contents}}
</template>
<script>
import * as fileLoader from '~/helpers/fileLoader'
import WindowDataMixin from './window-data-mixin'
export default {
  mixins: [WindowDataMixin],
  computed: {
    contents () {
      const fnName = this.programData.type.replace('-', '')
      if (fileLoader.hasOwnProperty(fnName)) {
        return fileLoader[fnName](this.programData.metadata)
      } else {
        return 'Unable to read file.'
      }
    }
  }
}
</script>
