<template lang="pug">
h1.push-top Welcome to Big Chat
CategoryList(
  :categories="categories"
)
</template>
<script>
import CategoryList from '@/components/CategoryList'
import { mapActions } from 'vuex'
export default {
  components: {
    CategoryList
  },
  methods: {
    ...mapActions(['fetchAllCategories', 'fetchForums'])
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  async created () {
    const categories = await this.fetchAllCategories()
    const forumIds = categories.map(category => category.forums).flat()
    this.fetchForums({ ids: forumIds })
  }
}
</script>
<style scoped>
</style>
