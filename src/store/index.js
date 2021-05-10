import { createStore } from 'vuex'
import { findById, upsert } from '@/helpers'
import firebase from 'firebase'
import getters from '@/store/getters'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
export default createStore({
  state: {
    categories: [],
    forums: [],
    threads: [],
    posts: [],
    users: [],
    authId: 'rpbB8C6ifrYmNDufMERWfQUoa202'
  },
  getters,
  actions,
  mutations
})
