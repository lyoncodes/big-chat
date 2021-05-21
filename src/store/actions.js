import firebase from 'firebase'
import { findById } from '@/helpers'
export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = Math.floor(Date.now() / 1000)
    // create database record and update other records
    // batch write
    const batch = firebase.firestore().batch()

    const postRef = firebase.firestore().collection('posts').doc()
    const threadRef = firebase.firestore().collection('threads').doc(post.threadId)

    batch.set(postRef, post)
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
    })
    await batch.commit()

    // create instance in vuex store, passing newly created id from firestore as id
    commit('setItem', { resource: 'posts', item: { ...post, id: postRef.id } })
    commit('appendPostToThread', { childId: postRef.id, parentId: post.threadId })
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  async createThread ({ commit, dispatch, state }, { text, title, forumId }) {
    const id = 'mmmm' + Math.random()
    const userId = state.authId
    const publishedAt = Math.floor(Date.now() / 1000)
    const thread = { publishedAt, userId, id, forumId, title }
    commit('setItem', { resource: 'threads', item: thread })
    commit('appendThreadToForum', { parentId: forumId, childId: id })
    commit('appendThreadToUser', { parentId: userId, childId: id })
    dispatch('createPost', { text, threadId: id })
    // now find the thread in the state and return it
    // the save method in ThreadCreate is awaiting this return value
    return findById(state.threads, id)
  },
  async updateThread ({ commit, state }, { id, title, text }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
    const newThread = { ...thread, title }
    const newPost = { ...post, text }
    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })
    return newThread
  },
  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user })
  },
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, emoji: '🏷' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '📃' }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: '🧶' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, emoji: '💬' }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, emoji: '🤦‍♂️' }),
  fetchAuthUser: ({ dispatch, state }, { id }) => dispatch('fetchItem', { resource: 'users', id: state.authId, emoji: '🤦‍♂️' }),
  fetchAllCategories ({ commit }) {
    return new Promise((resolve) => {
      firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
        const categories = querySnapshot.docs.map(doc => {
          const item = { id: doc.id, ...doc.data() }
          commit('setItem', { resource: 'categories', item })
          return item
        })
        resolve(categories)
      })
    })
  },
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, emoji: '🏷' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: '📃' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: '🧶' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, emoji: '🤦‍♂️' }),
  fetchItem ({ state, commit }, { id, emoji, resource }) {
    console.log('🥊 ' + emoji, id)
    return new Promise((resolve) => {
      firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        const item = { ...doc.data(), id: doc.id }
        commit('setItem', { resource, item })
        resolve(item)
      })
    })
  },
  fetchItems ({ dispatch }, { ids, resource, emoji }) {
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })))
  }
}
