<template>
  <v-btn
    :style="styles"
    color="primary"
    fab
    small
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </v-btn>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'BaseBtn',

    props: {
      square: Boolean,
    },

    computed: {
      styles () {
        return {
          borderRadius: this.square ? '2px' : undefined,
        }
      },
    },
  })
</script>
