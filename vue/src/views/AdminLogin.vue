<template>
  <v-container>
    <v-row>
      <v-spacer cols="12" md="3"></v-spacer>
      <v-col cols="12" md="5">
        <v-form @submit.prevent="login()" class="mt-6">
          <v-text-field
            v-model="username"
            label="Username"
            type="text"
            required
          ></v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit">Log In</v-btn>
        </v-form>
      </v-col>
      <v-spacer cols="12" md="3"></v-spacer>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    data: () => ({
      username: '',
      password: ''
    }),
    methods: {
      login: function() {
        const { username, password } = this
        this.$store.dispatch('authRequest', { username, password }).then(() => {
          this.$router.push('/')
        })
      }
    }
  })
</script>