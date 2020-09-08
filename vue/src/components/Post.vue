<template>
  <v-container @submit="updatePost">
    <v-row>
      <v-col cols="12" md="6">
        <h2>{{ post.title }}</h2>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn 
          v-if="isAuthenticated"
          class="btn"
          type="button"
          @click="showForm = true"
        >Edit
        </v-btn>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn 
          v-if="isAuthenticated && showForm"
          class="btn"
          type="button"
          @click="showForm = false"
        >Cancel
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <h5>{{ post.category }}</h5>
      <v-icon>TODO</v-icon>
    </v-row>
    <v-row>
      <v-img :src="require(`@/assets/images/${post.images[0]}`)" aspect-ratio="2"></v-img>
    </v-row>
    <v-row>
      <p>{{ post.body }}</p>
    </v-row>
    <v-row>
      <v-img :src="require(`@/assets/images/${post.images[1]}`)" aspect-ratio="2"></v-img>
    </v-row>
    <v-row>
      <a v-for="ref in post.refs" :key="ref" :href="`#${ref}`"></a>
    </v-row>
    <post-form
      v-if="isAuthenticated && showForm"
      :post="post"
    ></post-form>
  </v-container>
</template>

<script lang="ts">
  import Vue, { PropType } from 'vue'
  import axios from 'axios'
  import { mapGetters } from 'vuex'
  import PostForm from '@/components/PostForm.vue'

  type Post = {
    title: string;
    author: string;
    iconName: string;
    category: string;
    body: string;
    images: string[];
    refs: number[];
    published: boolean;
  }

  export default Vue.extend({
    components: {
      PostForm,
    },
    props: {
      post: {
        type: Object as PropType<Post>,
        required: true,
      }
    },
    data: () => ({
      showForm: false,
      // post: {
      //   title: '',
      //   author: '',
      //   iconName: '',
      //   category: '',
      //   body: '',
      //   images: [],
      //   refs: [],
      //   published: true
      // },
    }),
    computed: {
      ...mapGetters([
        'isAuthenticated'
      ])
    },
    methods: {
      updatePost: function(post: any) {
        axios.post('http://localhost:8000/update-post', JSON.stringify(post))
          .then((response: any) => {
            console.log("Success")
            console.log(response)
          }).catch((error: any) => {
            throw new Error(`API ${error}`)
          })
      }
    }
  })
</script>