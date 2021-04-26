<template lang="pug">
h1.push-top Welcome to Big Chat
CategoryList(
  :categories="categories"
)
</template>
<script>
import CategoryList from '@/components/CategoryList'
export default {
  components: {
    CategoryList
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  created () {
    console.log('created', this.categories)
  },
  beforeMount () {
    console.log('beforeMount', this.categories)
  },
  mounted () {
    console.log('mounted', this.categories, this.$el)
  }
}
</script>
<style scoped>
</style>
