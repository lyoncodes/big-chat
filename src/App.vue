<template>
  <TheNavbar />
  <router-view class="container" v-show="showPage" @ready="showPage = true"/>
  <AppSpinner class="push-top" v-show="!showPage"></AppSpinner>
</template>

<script>
import TheNavbar from './components/TheNavbar.vue'
import { mapActions } from 'vuex'
export default {
  name: 'App',
  components: { TheNavbar },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser'])
  },
  created () {
    this.fetchAuthUser()
    this.$router.beforeEach(() => {
      this.showPage = false
    })
  }
}
</script>

<style scoped>
@import "assets/style.css"
</style>
