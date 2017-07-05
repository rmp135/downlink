export const state = {
  messages: [
    {
      read: false,
      accepted: false,
      completed: false,
      type: 'job',
      subject: 'Welcome to Downlink',
      body: `Your mission, if you choose to accept it involves breaking into a secure facility and deleting files of a sensitive nature.
When you accept, you will receive a message with the target and information required to find the credentials.

You may wish to purchase some programs before attacking the target. Connect to 332.112.3.112 with the username: root, password: alpine and transfer what you require.

The funds will be automatically removed when the transfer is complete.`,
      conditions: [
        {
          type: 'file',
          exists: false,
          target: '85.201.52.2',
          filename: 'sensitive data'
        }
      ],
      onComplete: {
        messages: [
          {
            subject: 'Mission complete.',
            body: 'Congratulations on completing the first mission of Downlink!'
          }
        ]
      },
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
                name: 'sensitive data',
                guid: 'a4d51ca2-46e8-4325-8ad0-491525b2443b',
                position: 9,
                size: 1,
                loaded: 1
              }
            ]
          }
        }]
      }
    }
  ]
}

export const actions = {
  performJobActions ({ commit }, message) {
    const action = message.accepted && !message.completed ? 'onAccept' : 'onComplete'
    if (message[action].hasOwnProperty('messages')) {
      message[action].messages.forEach(m => commit('ADD_MESSAGE', m))
    }
    if (message[action].hasOwnProperty('targets')) {
      message[action].targets.forEach(m => commit('targetModule/ADD_TARGET', m, { root: true }))
    }
  },
  acceptJob ({ commit, dispatch }, message) {
    if (message.accepted) return
    commit('UPDATE_MESSAGE', { message, newMessage: { accepted: true }})
    dispatch('performJobActions', message)
  },
  attemptCompleteJob ({ commit, dispatch, rootState }, message) {
    function isConditionSatisfied (condition) {
      switch (condition.type) {
        case 'file':
          const files = rootState.targetModule.availableTargets
            .find(t => t.address === condition.target)
            .storage.files
          if (condition.exists) {
            return files.some(f => f.name === condition.filename)
          } else {
            return files.every(f => f.name !== condition.filename)
          }
      }
    }
    const completed =  message.conditions.every(c => isConditionSatisfied(c))
    if (completed) {
      commit('UPDATE_MESSAGE', { message, newMessage: { completed: true }})
      dispatch('performJobActions', message)
    } else {
      commit('ADD_MESSAGE', { subject: 'Criteria not satisfied.', body: 'The criteria for this mission has not been satisfied.' })
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