<template>
<div class="forum-list col-full">
  <ForumList
    v-for="category in categories"
    :key="category.id"
    :forums="getForumsForCategory(category)"
    :title="category.name"
    :categoryId="category.id"
  />

</div>
</template>
<script>
import ForumList from '@/components/ForumList'
import sourceData from '@/data.json'
export default {
  components: {
    ForumList
  },
  props: {
    categories: {
      required: true,
      type: Array
    }
  },
  methods: {
    getForumsForCategory (category) {
      return sourceData.forums.filter(forum => forum.categoryId === category.id)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
