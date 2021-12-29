<template>
  <div class="container">
    <div class="flex-grid">
          <div class="col-3 push-top">
              <UserProfileCard v-if="!edit" :user="user"/>
              <UserProfileEditor v-else :user="user" />

          </div>

          <div class="col-7 push-top">

              <div class="profile-header">
                  <span class="text-lead">
                      {{ user.username }}'s recent activity
                  </span>
                  <a href="#">See only started threads?</a>
              </div>

              <hr>

            <PostList :posts="user.posts" />
          </div>
      </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import PostList from '@/components/PostList'
import UserProfileCard from '@/components/UserProfileCard.vue'
import UserProfileEditor from '@/components/UserProfileEditor.vue'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  mixins: [asyncDataStatus],
  components: { PostList, UserProfileCard, UserProfileEditor },
  computed: {
    ...mapGetters({ user: 'authUser' })
  },
  beforeRouteEnter (to, from) {
    if (!store.state.authId) return { name: 'Home' }
  },
  async created () {
    this.asyncDataStatus_fetched()
  }
}
</script>
<style lang="scss" scoped>

</style>
