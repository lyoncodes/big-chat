<template>
  <header class="header" id="header">
    <router-link :to="{name: 'Home'}" class="logo">
      <img src="../assets/svg/vueschool-logo.svg">
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
        <ul>
            <li v-if="authUser" class="navbar-user">
                <a @click.prevent="userDropDownOpen = !userDropDownOpen">
                    <img class="avatar-small" :src="authUser.avatar" :alt="`${authUser.name}profile picture`">
                    <span>
                        {{ authUser.name }}
                        <img class="icon-profile" src="../assets/svg/arrow-profile.svg" alt="">
                    </span>
                </a>

                <!-- dropdown menu -->
                <!-- add class "active-drop" to show the dropdown -->
                <div id="user-dropdown" :class="{ 'active-drop': userDropDownOpen }">
                    <div class="triangle-drop"></div>
                    <ul class="dropdown-menu">
                        <li class="dropdown-menu-item"><router-link :to="{name: 'Profile'}" >View profile</router-link></li>
                        <li class="dropdown-menu-item"><a @click.prevent="$store.dispatch('signOut')">Log out</a></li>
                    </ul>
                </div>
            </li>
            <li v-if="!authUser" class="navbar-item"><router-link :to="{name: 'SignIn'}">Sign In</router-link></li>
            <li v-if="!authUser" class="navbar-item"><router-link :to="{name: 'Register'}">Register</router-link></li>
        </ul>
    </nav>
  </header>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      userDropDownOpen: false
    }
  },
  computed: {
    ...mapGetters(['authUser'])
  }
}
</script>
<style lang="scss" scoped>

</style>
