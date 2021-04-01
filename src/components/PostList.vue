<template>
<div class="post-list">
  <div class="post"
        v-for="post in posts"
        :key="post.id"
  >

    <div class="user-info">
      <a href="#" class="user-name">{{userById(post.userId).username}}</a>

      <a href="#">
        <img class="avatar-large" :src="userById(post.userId).avatar" alt="">
      </a>

      <p class="desktop-only text-small">107 posts</p>

    </div>

    <div class="post-content">
      <div>
        <p>
          {{post.text}}
        </p>
      </div>
    </div>

    <div class="post-date text-faded" :title="fullDate(post.publishedAt)">
      {{ diffForHumans(post.publishedAt) }}
    </div>

  </div>
</div>
</template>
<script>
import sourceData from '@/data.json'

// date functionality
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDates from 'dayjs/plugin/localizedFormat'

dayjs.extend(relativeTime)
dayjs.extend(localizedDates)

export default {
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      users: sourceData.users
    }
  },
  methods: {
    userById (userId) {
      return this.users.find(p => p.id === userId)
    },
    diffForHumans (timestamp) {
      return dayjs.unix(timestamp).fromNow()
    },
    fullDate (timestamp) {
      return dayjs.unix(timestamp).format('llll')
    }
  }
}
</script>
<style scoped lang="scss">
</style>
