<template>
  <TheNavbar />
  <router-view/>
</template>

<script>
import TheNavbar from './components/TheNavbar.vue'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: { TheNavbar },
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser({ id: this.$store.state.authId })
  }
}
</script>

<style scoped>
@import "assets/style.css"
</style>
