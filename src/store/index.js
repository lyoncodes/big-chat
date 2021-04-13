import { createStore } from 'vuex'
import sourceData from '@/data'

export default createStore({
  state: {
    ...sourceData,
    authId: 'rpbB8C6ifrYmNDufMERWfQUoa202'
  },
  actions: {
    createPost ({ commit }, post) {
      post.id = 'mmmm' + Math.random()
      commit('setPost', { post })
      commit('appendPostToThread', { postId: post.id, threadId: post.threadId })
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
    appendPostToThread (state, { postId, threadId }) {
      // find the thread where the post belongs
      const thread = state.threads.find(thread => thread.id === threadId)
      // push to that thread's posts array
      thread.posts.push(postId)
    }
  }
})
