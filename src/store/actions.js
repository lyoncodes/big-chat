import firebase from 'firebase'
import { findById, docToResource } from '@/helpers'
export default {

  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    // create database record and update other records
    // batch write
    const batch = firebase.firestore().batch()

    const postRef = firebase.firestore().collection('posts').doc()
    const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
    const userRef = firebase.firestore().collection('users').doc(state.authId)

    batch.set(postRef, post)
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
    })
    batch.update(userRef, {
      postsCount: firebase.firestore.FieldValue.increment(1)
    })
    await batch.commit()

    const newPost = postRef.get()
    // create instance in vuex store, passing newly created id from firestore as id
    commit('setItem', { resource: 'posts', item: { ...newPost, id: postRef.id } })
    commit('appendPostToThread', { childId: postRef.id, parentId: post.threadId })
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },

  async updatePost ({ commit, state }, { text, id }) {
    const post = {
      text,
      edited: {
        at: firebase.firestore.FieldValue.serverTimestamp(),
        by: state.authId,
        moderated: false
      }
    }
    const postRef = firebase.firestore().collection('posts').doc(id)
    await postRef.update(post)
    const updatedPost = await postRef.get()
    commit('setItem', { resource: 'posts', item: updatedPost })
  },

  async createThread ({ commit, dispatch, state }, { text, title, forumId }) {
    const userId = state.authId
    const publishedAt = firebase.firestore.FieldValue.serverTimestamp()

    // batch write
    const batch = firebase.firestore().batch()

    const threadRef = firebase.firestore().collection('threads').doc()
    const thread = { publishedAt, userId, id: threadRef.id, forumId, title }
    const userRef = firebase.firestore().collection('users').doc(userId)
    const forumRef = firebase.firestore().collection('forums').doc(forumId)

    batch.set(threadRef, thread)
    batch.update(userRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
    })
    batch.update(forumRef, {
      threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
    })
    await batch.commit()

    const newThread = await threadRef.get()

    // create instance in vuex, passing newly created id from firestore as id
    commit('setItem', { resource: 'threads', item: { ...newThread.data(), id: newThread.id } })
    commit('appendThreadToUser', { parentId: userId, childId: threadRef.idid })
    commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id })
    await dispatch('createPost', { text, threadId: threadRef.id })

    // now find the thread in the state and return it
    // the save method in ThreadCreate is awaiting this return value
    return findById(state.threads, threadRef.id)
  },

  async updateThread ({ commit, state }, { id, title, text }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
    let newThread = { ...thread, title }
    let newPost = { ...post, text }

    const threadRef = firebase.firestore().collection('threads').doc(id)
    const postRef = firebase.firestore().collection('posts').doc(post.id)
    const batch = firebase.firestore().batch()

    batch.update(threadRef, newThread)
    batch.update(postRef, newPost)
    await batch.commit()

    newThread = await threadRef.get()
    newPost = await postRef.get()

    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })
    return docToResource(newThread)
  },

  // =====
  // Users
  // =====
  // async searchForUser({ dispatch }, { user, collection }){}

  async registerUserWithEmailAndPassword ({ dispatch }, { email, name, username, password, avatar = null }) {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
    await dispatch('createUser', { id: result.user.uid, email, name, username, avatar })
  },

  signInWithEmailAndPassword (context, { email, password }) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },

  // signInWithGithub () {
  //   const provider = new firebase.auth.GithubAuthProvider
  // },

  async signInWithGoogle ({ dispatch }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    const res = await firebase.auth().signInWithPopup(provider)
    const user = res.user // <= this is an authenticated user

    const userRef = firebase.firestore().collection('users').doc(user.uid)
    const userDoc = await userRef.get()
    if (!userDoc.exists) {
      return dispatch('createUser', {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        username: user.email,
        avatar: user.photoURL
      })
    }
  },

  async signOut ({ commit }) {
    await firebase.auth().signOut()
    commit('setAuthId', null)
  },

  async createUser ({ commit }, { id, email, name, username, avatar = null }) {
    const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
    const usernameLower = username.toLowerCase()
    email = email.toLowerCase()

    const user = { avatar, email, name, username, usernameLower, registeredAt }

    const userRef = firebase.firestore().collection('users').doc(id)
    userRef.set(user)

    const newUser = await userRef.get()
    commit('setItem', { resource: 'users', item: newUser })

    return docToResource(newUser)
  },

  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user })
  },

  //
  // Fetch a resource
  //
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, emoji: '🏷' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '📃' }),
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: '🧶' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, emoji: '💬' }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, emoji: '🤦‍♂️' }),
  fetchAuthUser: ({ dispatch, state, commit }) => {
    const userId = firebase.auth().currentUser?.uid
    if (!userId) return
    dispatch('fetchItem', {
      resource: 'users',
      id: userId,
      emoji: '🤦‍♂️',
      handleUnsubscribe: (unsubscribe) => {
        commit('setAuthUserUnsubscribe', unsubscribe)
      }
    })
    commit('setAuthId', userId)
  },

  //
  // Fetch All Categories
  //
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

  //
  // Fetch Multiple Resources
  //
  fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'categories', ids, emoji: '🏷' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: '📃' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: '🧶' }),
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: '💬' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, emoji: '🤦‍♂️' }),

  //
  // Fetchers
  //
  fetchItem ({ state, commit }, { id, emoji, resource, handleUnsubscribe = null }) {
    console.log('🥊 ' + emoji, id)
    return new Promise((resolve) => {
      const unsubscribe = firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        const item = { ...doc.data(), id: doc.id }
        commit('setItem', { resource, item })
        resolve(item)
      })
      if (handleUnsubscribe) {
        handleUnsubscribe(unsubscribe)
      } else {
        commit('appendUnsubscribe', { unsubscribe })
      }
    })
  },

  fetchItems ({ dispatch }, { ids, resource, emoji }) {
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })))
  },

  //
  // Unsubscribes
  //
  async unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubscribe => unsubscribe())
    commit('clearAllUnsubscribes')
  },

  async unsubscribeAuthUserSnapshot ({ state, commit }) {
    if (state.authUserUnsubscribe) {
      state.authUserUnsubscribe()
      commit('setAuthUserUnsubscribe', null)
    }
  }
}
