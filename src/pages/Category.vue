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
import sourceData from '@/data.json'
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
      return sourceData.categories.find(category => category.id === this.id)
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
