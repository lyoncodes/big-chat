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
import ForumList from '@/components/ForumList'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'

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
      return findById(this.$store.state.categories, this.id) || {}
    }
  },
  methods: {
    ...mapActions(['fetchCategory', 'fetchFoums']),
    getForumsForCategory (category) {
      return this.$store.state.forums.filter(forum => forum.categoryId === category.id)
    }
  },
  async created () {
    const category = await this.fetchCategory({ id: this.id })
    return this.fetchForums({ ids: category.forums })
  }
}
</script>
<style lang="scss" scoped>

</style>
