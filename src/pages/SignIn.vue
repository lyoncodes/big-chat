<template>
  <div class="flex-grid justify-center">
    <div class="col-2">
      <form @submit.prevent="signIn" class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="form.email" id="email" type="email" class="form-input" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="form.password" id="password" type="password" class="form-input" />
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-blue btn-block">Log In</button>
        </div>
        <div class="form-actions text-right">
          <router-link :to="{name: 'Register'}">Create New Account</router-link>
        </div>
      </form>
      <div class="text-center push-top">
        <button class="btn-red btn-xsmall" @click="signInWithGoogle">
          <i class="fa fa-google fa-btn"></i>Sign in with Google
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async signIn () {
      try {
        await this.$store.dispatch('signInWithEmailAndPassword', { ...this.form })
        this.$router.push('/')
      } catch (err) {
        alert(err.message)
      }
    },
    async signInWithGoogle () {
      await this.$store.dispatch('signInWithGoogle')
      this.$router.push('/')
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>
<style scoped>

</style>
