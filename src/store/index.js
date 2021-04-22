import { createStore } from 'vuex'
import sourceData from '@/data'
import { findById, upsert } from '@/helpers'

export default createStore({
  state: {
    ...sourceData,
    authId: 'rpbB8C6ifrYmNDufMERWfQUoa202'
  },
  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'mmmm' + Math.random()
      post.userId = state.authId
      post.publishedAt = Math.floor(Date.now() / 1000)
      commit('setPost', { post })
      commit('appendPostToThread', { childId: post.id, parentId: post.threadId })
    },
    async createThread ({ commit, dispatch, state }, { text, title, forumId }) {
      const id = 'mmmm' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { publishedAt, userId, id, forumId, text, title }
      commit('setThread', { thread })
      commit('appendThreadToForum', { parentId: forumId, childId: id })
      commit('appendThreadToUser', { parentId: userId, childId: id })
      dispatch('createPost', { text, threadId: id })
      // now find the thread in the state and return it
      // the save method in ThreadCreate is awaiting this return value
      return findById(state.threads, id)
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    },
    async updateThread ({ commit, dispatch, state }, { id, title, text }) {
      const thread = findById(state.threads, id)
      const post = findById(state.posts, thread.posts[0])
      const newThread = { ...thread, title }
      const newPost = { ...post, text }
      commit('setThread', { thread: newThread })
      commit('setPost', { post: newPost })
      return newThread
    }
  },
  getters: {
    authUser: state => {
      const user = findById(state.users, state.authId)
      if (!user) return null
      return {
        ...user,
        get posts () {
          return state.posts.filter(post => post.userId === user.id)
        },
        get threads () {
          return state.threads.filter(thread => thread.userId === user.id)
        },
        get postsCount () {
          return this.posts.length
        },
        get threadsCount () {
          return this.threads.length
        }
      }
    }

  },
  mutations: {
    setPost (state, { post }) {
      upsert(state.posts, post)
    },
    setThread (state, { thread }) {
      upsert(state.threads, thread)
    },
    setUser (state, { user, userId }) {
      const userIdx = state.users.findIndex(user => user.id === userId)
      state.users[userIdx] = user
    },
    appendPostToThread: makeAppendChildtoMutation({ parent: 'threads', child: 'posts' }),
    appendThreadToForum: makeAppendChildtoMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendChildtoMutation({ parent: 'users', child: 'threads' })
  }
})
function makeAppendChildtoMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] = resource[child] || []
    resource[child].push(childId)
  }
}
