<template lang="pug">
h1.push-top Welcome to Note Taker
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
  }
}
</script>
<style scoped>
</style>
