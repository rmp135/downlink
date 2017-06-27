<style lang="scss">
  .phone {

    .button {
      &:hover {
        border: 1px black solid;
        background: green;
        color: black;
        cursor: pointer;
      }
      &.disabled, &.disabled:hover {
        background: black;
        color:  darken(green, 10);
        border-color: darken(green, 10);
        cursor: not-allowed;
      }
      border: 1px green solid;
      background: black;
      color: green;
    }

    .conversation {
      height: 500px;
      overflow: auto;
      width: 400px;
      display: flex;
      flex-direction: column;
      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
      }

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: green;
      }
      .message {
        white-space: pre-line;
        width: 200px;
        &.them {
          align-self: flex-end;
        }
        &.system {
          align-self: center;
          text-align: center;
        }
      }
    }
  }
</style>
<template lang="pug">
  .phone
    div Phone number
    input.input
    div Card number
    input.input
    div Digits required
    input.input
    .button(@click="onConnect", :class="{disabled: isConnecting}") Connect
    .conversation(ref="conversation")
      .message(v-for="message in logs", :class="message.from") {{message.message}}
</template>
<script>
  export default {
    data: () => ({
      isConnecting: false,
      logs: [ ]
    }),
    methods: {
      randomNumber (min, max) {
        return Math.floor(Math.random() + min) * max
      },
      async addMessage ({ from, message }) {
        return new Promise(resolve => {
          const index = this.logs.push({
            from,
            message: ''
          })
          const _addMessage = (message, index) => {
            if (this.logs[index].message.length === message.length) return resolve()
            this.logs[index].message = message.slice(0, this.logs[index].message.length + 1)
            this.$nextTick(() => { this.$refs.conversation.scrollTop = this.$refs.conversation.scrollHeight })
            setTimeout(_addMessage.bind(this, message, index), 50)
          }
          _addMessage(message, index-1)
        })
      },
      async addMessages (messages) {
        return new Promise (resolve => {
          const _addMessages = async (messages, index) => {
            if (index === messages.length) return resolve()
            await this.addMessage(messages[index])
            setTimeout(_addMessages.bind(this, messages, index+1), 300)
          }
          _addMessages(messages, 0)
        })
      },
      async onConnect () {
        if (this.isConnecting) return
        this.isConnecting = true
        const newlogs = [
          {
            from: 'system',
            message: '--- call connecting ---'
          },
          {
            from: 'us',
            message: `Good afternoon. Our anti-fraud systems have detected a number of anomalies with your account ending in 2222. For fraud prevention purposes, can you confirm the amounts for the last 3 purchases made from this account.`
          },
          {
            from: 'them',
            message: `ok ... erm ... four dollars i think ... six dollars and around fifteen dollars ...`
          },
          {
            from: 'us',
            message: `That all looks correct. I can see a transaction for 3 hundred and forty seven dollars in the last week. Are you aware of this?`
          },
          {
            from: 'them',
            message: '... no i have no idea what that is ... can it be refunded ....'
          },
          {
            from: 'us',
            message: `Of course. In order to revoke this transaction, we will need to validate the first, third and sixth digit of your 6 digit secure sign in code. For security reasons, please do not provide the entire code.`
          },
          {
            from: 'them',
            message: 'yea ok ... first is ... two then nine then three ... no wait four ...'
          },
          {
            from: 'system',
            message: '--- call disconnected ---'
          }
        ]
        await this.addMessages(newlogs)
        this.isConnecting = false
      }
    },
  }
</script>
