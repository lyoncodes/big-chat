<template lang="pug">
div.container(v-if="asyncDataStatus_ready")
  h1.push-top Welcome to Big Chat
  CategoryList(
    :categories="categories"
  )
</template>
<script>
import CategoryList from '@/components/CategoryList'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  mixins: [asyncDataStatus],
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
    await this.fetchForums({ ids: forumIds })
    this.asyncDataStatus_fetched()
  }
}
</script>
<style scoped>
</style>
