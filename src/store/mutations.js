import { upsert, findById, docToResource } from '@/helpers'
export default {
  setItem (state, { resource, item }) {
    upsert(state[resource], docToResource(item))
  },

  setAuthId (state, id) {
    state.authId = id
  },

  setAuthUserUnsubscribe (state, unsubscribe) {
    state.authUserUnsubscribe = unsubscribe
  },

  appendUnsubscribe (state, { unsubscribe }) {
    state.unsubscribes.push(unsubscribe)
    console.log(state.unsubscribes)
  },
  clearAllUnsubscribes (state) {
    state.unsubscribes = []
  },

  appendPostToThread: makeAppendChildtoMutation({ parent: 'threads', child: 'posts' }),
  appendContributorToThread: makeAppendChildtoMutation({ parent: 'threads', child: 'contributors' }),
  appendThreadToForum: makeAppendChildtoMutation({ parent: 'forums', child: 'threads' }),
  appendThreadToUser: makeAppendChildtoMutation({ parent: 'users', child: 'threads' })
}

function makeAppendChildtoMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)

    if (!resource) {
      console.warn(`appending ${child} ${childId} to ${parent} ${parentId} failed because parent didn't exist`)
      return
    }

    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
