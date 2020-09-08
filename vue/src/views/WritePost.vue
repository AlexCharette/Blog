<template>
  <v-container @submit="submitPost">
    <post-form />
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import axios from 'axios'
  import { mapGetters } from 'vuex'
  import PostForm from '@/components/PostForm.vue'

  export default Vue.extend({
    components: {
      PostForm,
    },
    methods: {  
      submitPost: function(post: Record<string, any>) {
        axios.post('http://localhost:8000/submit-post', JSON.stringify(post))
          .then((response: any) => {
            console.log("Success")
            console.log(response)
          })
          .catch((error: any) => {
            console.log(error)
          })
      }
    }
  })
</script>