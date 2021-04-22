<template>
  <h1>{{ category.name }}</h1>
  <div class="forum-list col-full">
    <ForumList
      :title="category.name"
      :forums="getForumsForCategory(category)"
    />
  </div>
</template>
<script>
import { findById } from '@/helpers'
import ForumList from '@/components/ForumList'
export default {
  components: {
    ForumList
  },
  props: {
    id: {
      required: true,
      type: String
    }
  },
  computed: {
    category () {
      return findById(this.$store.state.categories, this.id)
    }
  },
  methods: {
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
