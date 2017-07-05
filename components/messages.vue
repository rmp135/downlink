<style lang="scss">
  .messages {
    height: 500px;
    display: flex;
    > * {
      flex-grow: 1;
      flex-basis: 0;
    }
    .left-pane {
      display: flex;
      flex-direction: column;
      padding-right: 10px;
      .message {
        &:hover {
          cursor: pointer;
          background: green;
          color: black;
        }
      }
    }
    .right-pane {
      width: 300px;
      padding-left: 10px;
      .body {
        white-space: pre-line;
        &.no-message {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      }
    }
  }
</style>
<template lang="pug">
  .messages
    .left-pane
      .message(v-for="(message, index) in messages", @click="onSubjectClick(index)")
        span.read(v-if="!message.read") *
        span.subject {{message.subject}}
    .right-pane
      .body.no-message(v-if="selectedMessageIndex === null") No message selected.
      .body(v-else) {{selectedMessage.body}}
        .buttons
          template(v-if="selectedMessage.type === 'job' && !selectedMessage.completed")
            .button(v-if="!selectedMessage.accepted", @click="acceptJob(selectedMessage)") Accept
            .button(v-else, @click="attemptCompleteJob(selectedMessage)") Complete
          .button(v-else, @click="deleteMessage(selectedMessageIndex)") Delete
</template>
<script>
  import Vuex from 'vuex'
  export default {
    data: () => ({
      selectedMessageIndex: null
    }),
    computed: {
      selectedMessage () {
        return this.messages[this.selectedMessageIndex]
      },
      ...Vuex.mapState('messagesModule', ['messages'])
    },
    methods: {
      onSubjectClick (index) {
        this.selectedMessageIndex = index
        this.updateMessage({ message: this.selectedMessage, newMessage: { read: true }})
      },
      deleteMessage (index) {
        this.selectedMessageIndex = null
        this.commitDeleteMessage(index)
      },
      ...Vuex.mapActions('messagesModule', ['acceptJob', 'attemptCompleteJob']),
      ...Vuex.mapMutations('messagesModule', {
        commitDeleteMessage: 'DELETE_MESSAGE',
        updateMessage: 'UPDATE_MESSAGE'
      })
    }
  }
</script>
