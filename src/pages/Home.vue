<template lang="pug">
h1 Welcome to Note Taker
CategoryList(
  :categories="categories"
)
</template>
<script>
import CategoryList from '@/components/CategoryList'
import sourceData from '@/data.json'
export default {
  data () {
    return {
      categories: sourceData.categories
    }
  },
  components: {
    CategoryList
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
