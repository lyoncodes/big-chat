import { createStore } from 'vuex'
import sourceData from '@/data'

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
      commit('appendPostToThread', { postId: post.id, threadId: post.threadId })
    },
    async createThread ({ commit, dispatch, state }, { text, title, forumId }) {
      const id = 'mmmm' + Math.random()
      const userId = state.authId
      const publishedAt = Math.floor(Date.now() / 1000)
      const thread = { publishedAt, userId, id, forumId, text, title }
      commit('setThread', { thread })
      commit('appendThreadToForum', { forumId, threadId: id })
      commit('appendThreadToUser', { userId, threadId: id })
      dispatch('createPost', { text, threadId: id })
      // now find the thread in the state and return it
      // the save method in ThreadCreate is awaiting this return value
      return state.threads.find(thread => thread.id === id)
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    }
  },
  getters: {
    authUser: state => {
      const user = state.users.find(user => user.id === state.authId)
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
      state.posts.push(post)
    },
    setThread (state, { thread }) {
      state.threads.push(thread)
    },
    setUser (state, { user, userId }) {
      const userIdx = state.users.findIndex(user => user.id === userId)
      state.users[userIdx] = user
    },
    appendPostToThread (state, { postId, threadId }) {
      // find the thread where the post belongs
      const thread = state.threads.find(thread => thread.id === threadId)
      // check to see if the thread has posts, if not, add them literally
      thread.posts = thread.posts || []
      // push to that thread's posts array
      thread.posts.push(postId)
    },
    appendThreadToForum (state, { forumId, threadId }) {
      const forum = state.forums.find(forum => forum.id === forumId)
      forum.threads = forum.threads || []
      forum.threads.push(threadId)
    },
    appendThreadToUser (state, { userId, threadId }) {
      const user = state.users.find(user => user.id === userId)
      user.threads = user.threads || []
      user.threads.push(threadId)
    }
  }
})
