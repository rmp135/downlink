export const state = {
  messages: [
    {
      read: false,
      accepted: false,
      type: 'job',
      subject: 'Welcome to Downlink',
      body: `Your mission, if you choose to accept it involves breaking into a secure facility and deleting files of a sensitive nature.
When you accept, you will receive a message with the target and information required to find the credentials.

You may wish to purchase some programs before attacking the target. Connect to 332.112.3.112 with the username: root, password: alpine and transfer what you require.

The funds will be automatically removed when the transfer is complete.`,
      conditions: [],
      onAccept: {
        messages: [
          {
            type: 'spam',
            body: '85.201.52.2. John Appleseed.'
          }
        ],
        shop: [],
        targets: [{
          address: '85.201.52.2',
          credentials: {
            username: 'john.appleseed',
            password: 'buster'
          },
          user: {
            name: 'John Appleseed',
            card: '44568179001025',
            cardPIN: '389123',
            securityLevel: 1,
            timesCalled: 0,
            balance: 21442,
            social: {
              username: 'john.appleseed',
              updates: [
                'cant believe my boy buster is five today. best dog a man could ask for.'
              ]
            }
          },
          storage: {
            capacity: 20,
            files: [
              {
                name: 'botnet definition',
                guid: 'guidd2',
                position: 9,
                size: 1,
                loaded: 1,
                type: 'botnet-definition',
                metadata: {
                  burnedNodes: 0,
                  nodes: [
                    '30.2.25.160',
                    '147.248.93.21',
                    '29.153.58.210',
                    '104.7.102.87',
                    '193.230.153.19',
                    '65.157.61.136',
                    '171.117.136.215'
                  ]
                }
              }
            ]
          }
        }]
      }
    }
  ]
}

export const actions = {
  acceptJob ({ commit }, message) {
    if (message.accepted) return
    commit('UPDATE_MESSAGE', { message, newMessage: { accepted: true }})
    if (message.onAccept.hasOwnProperty('messages')) {
      message.onAccept.messages.forEach(m => commit('ADD_MESSAGE', m))
    }
    if (message.onAccept.hasOwnProperty('targets')) {
      message.onAccept.targets.forEach(m => commit('targetModule/ADD_TARGET', m, { root: true }))
    }
  }
}

export const mutations = {
  UPDATE_MESSAGE (state, { message, newMessage }) {
    Object.assign(message, newMessage)
  },
  ADD_MESSAGE (state, message) {
    const newMessage = {
      type: 'spam',
      subject: 'No subject.',
      body: 'No body.',
      conditions: [],
      onAccept: {},
      ...message
    }
    state.messages.push(newMessage)
  },
  DELETE_MESSAGE (state, messageIndex) {
    state.messages.splice(messageIndex, 1)
  }
}