<template lang="pug">
  .window-frame(:style="{left:window.position.x+'px', top:window.position.y+'px'}")
    .title-bar(@mousedown="onMouseDown", @mouseup="onMouseUp")
      span.minimise(@click="onMinimiseClick") _
      span.title {{window.title}}
      span.close(@click="onCloseClick") X
    .content(:class="{minimised: minimised}")
      div(:is="window.program")
</template>
<style lang="scss">
  .window-frame {
    border: 1px solid green;
    position: absolute;
    .title-bar {
      cursor: move;
      padding: 5px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid green;
      .minimise, .close {
        cursor: pointer;
      }
    }
    .content {
      overflow: hidden;
      &.minimised {
        height: 0;
        visibility: hidden;
      }
    }
  }
</style>
<script>
  import { mapState, mapMutations } from 'vuex'
  import Tracker from '~components/tracker'
  import DiskManager from '~components/disk-manager'
  import Processor from '~components/processor'

  export default {
    props: {
      window: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        dragging: false,
        minimised: false,
        dragPoint: {
          x: 0,
          y: 0
        }
      }
    },
    computed: {
      ...mapState({
        mousePosition: (state) => state.global.mousePosition
      })
    },
    mounted () {
      this.$watch('mousePosition', () => {
        if (this.dragging) {
          const newPosition = {
            x: this.mousePosition.x - this.dragPoint.x,
            y: this.mousePosition.y - this.dragPoint.y
          }
          this.updateWindow({ window: this.window, newWindow: { position: newPosition } })
        }
      }, { deep: true })
    },
    methods: {
      onMouseDown (e) {
        this.dragging = true
        this.dragPoint.x = e.layerX
        this.dragPoint.y = e.layerY
      },
      onMouseUp () {
        this.dragging = false
      },
      onCloseClick () {
        this.removeWindow(this.window)
      },
      onMinimiseClick () {
        this.minimised = !this.minimised
      },
      ...mapMutations('windows', {
        updateWindow: 'UPDATE_WINDOW',
        removeWindow: 'REMOVE_WINDOW'
      })
    },
    components: {
      Tracker,
      DiskManager,
      Processor
    }
  }
</script>