<template>
<div class="post-list">
  <div class="post"
        v-for="post in posts"
        :key="post.id"
  >

    <div v-if="userById(post.userId)" class="user-info">
      <a href="#" class="user-name">{{ userById(post.userId).username }}</a>

      <a href="#">
        <img class="avatar-large" :src="userById(post.userId).avatar" alt="">
      </a>

      <p class="desktop-only text-small">{{ userById(post.userId).postsCount }} posts</p>
      <p class="desktop-only text-small">{{ userById(post.userId).threadsCount }} threads</p>

    </div>

    <div class="post-content">
      <div class="col-full">
        <post-editor
        v-if="editing === post.id"
        :post="post"
        @save="updatePost($event.post)"
        />
        <p v-else>
          {{post.text}}
        </p>
      </div>
      <a
      @click.prevent="toggleEditMode(post.id)"
      href="#"
      style="margin-left: auto; padding-left: 10px"
      class="link-unstyled"
      title="Make a change">
        <fa icon="pencil-alt" />
      </a>
    </div>

    <div class="post-date text-faded">
      <AppDate :timestamp="post.publishedAt" />
    </div>

  </div>
</div>
</template>
<script>
import PostEditor from '@/components/PostEditor.vue'
import { mapActions } from 'vuex'
export default {
  components: { PostEditor },
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      editing: null
    }
  },
  computed: {
    users () {
      return this.$store.state.users
    }
  },
  methods: {
    ...mapActions(['updatePost']),
    userById (userId) {
      return this.$store.getters.user(userId)
    },
    toggleEditMode (id) {
      this.editing = id === this.editing ? null : id
    }
  }
}
</script>
<style scoped lang="scss">
</style>
