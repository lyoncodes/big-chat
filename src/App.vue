<template>
  <the-navbar />
  <router-view/>
</template>

<script>
import TheNavbar from './components/TheNavbar.vue'

export default {
  components: { TheNavbar },
  name: 'App'
}
</script>

<style scoped>
@import "assets/style.css"
</style>
