<style lang="scss">
  .window-frame {
    border: 1px solid green;
    position: absolute;
    background-color: black;
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
<template lang="pug">
  .window-frame(@mousedown="onMouseDown", :style="{zIndex: window.index, left:window.position.x+'px', top:window.position.y+'px'}")
    .title-bar(@mousedown="onTitleMouseDown", @mouseup="onMouseUp")
      span.minimise(@click="onMinimiseClick") _
      span.title {{window.title}}
      span.close(@click="onCloseClick") X
    .content(:class="{minimised: minimised}")
      div(:is="window.program", :program-data="window.data", :window-data="window", @close="onCloseClick")
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
  import DiskManager from '~components/disk-manager'
  import ActivityMonitor from '~components/activity-monitor'
  import FilePreview from '~components/file-preview'
  import Connector from '~components/connector'
  import LoginBox from '~components/login-box'
  import BotNet from '~components/botnet'
  import Phone from '~components/phone'
  import Messages from '~components/messages'
  import FaceFinder from '~components/face-finder'

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
      ...mapState('globalModule', ['mousePosition'])
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
      onTitleMouseDown (e) {
        this.dragging = true
        this.dragPoint.x = e.layerX
        this.dragPoint.y = e.layerY
      },
      onMouseDown () {
        this.setTopWindow(this.window)
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
      ...mapMutations('windowsModule', {
        updateWindow: 'UPDATE_WINDOW',
        removeWindow: 'REMOVE_WINDOW',
        setTopWindow: 'SET_TOP_WINDOW'
      })
    },
    components: {
      DiskManager,
      ActivityMonitor,
      FilePreview,
      Connector,
      LoginBox,
      BotNet,
      Phone,
      Messages,
      FaceFinder
    }
  }
</script>