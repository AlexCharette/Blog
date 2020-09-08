<template>
  <v-app>
    <core-app-bar />

    <core-drawer />

    <core-view />

    <core-footer />

    <core-cta />
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue'
  import axios from 'axios'

  export default Vue.extend({
    name: 'App',

    components: {
      CoreCta: () => import('@/components/core/Cta.vue'),
      CoreDrawer: () => import('@/components/core/Drawer.vue'),
      CoreFooter: () => import('@/components/core/Footer.vue'),
      CoreAppBar: () => import('@/components/core/AppBar.vue'),
      CoreView: () => import('@/components/core/View.vue'),
    },
    created: function() {
      axios.interceptors.response.use(undefined, function(this: any, error) {
        return new Promise(() => {
          if (error.status === 401 && error.config && !error.config.__isRetryRequest) {
            this.$store.dispatch('authLogout')
          }
          throw error
        })
      })
    }
  })
</script>
