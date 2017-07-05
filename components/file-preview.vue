<style lang="scss">
  .file-preview {
    .contents {
      white-space: pre-line;
    }
    width: 200px;
    height: 200px;
    overflow: auto;
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
      debugger
      if (Object.prototype.hasOwnProperty.call(fileLoader, fnName)) {
        return fileLoader[fnName](this.programData.metadata)
      } else {
        return 'Unable to read file.'
      }
    }
  }
}
</script>
