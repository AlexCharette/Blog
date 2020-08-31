<template>
  <div id="home">
    <articles>
      <banner />
    </articles>

    <about />

    <subscribe />

    <social />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'Home',

    components: {
      About: () => import('@/components/home/About.vue'),
      Articles: () => import('@/components/home/Articles.vue'),
      Banner: () => import('@/components/home/Banner.vue'),
      Social: () => import('@/components/home/Social.vue'),
      Subscribe: () => import('@/components/home/Subscribe.vue'),
    },
  })
</script>
