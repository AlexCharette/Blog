<template>
  <v-container>
    <v-form @submit.prevent="dispatch">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="post.title"
            label="Title"
            required
            prepend-icon="mdi-format-title"
          >{{ compPrevPost.title }}
          </v-text-field>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="post.author"
            label="Author"
            required
            prepend-icon="mdi-account-edit"
          >{{ compPrevPost.author }}
          </v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="2">
          <v-select
            v-model="post.category"
            :items="postCategories"
            label="Category"
            required
            prepend-icon="mdi-shape-outline"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            v-model="post.iconName"
            :items="iconNames"
            label="Icon Name"
            prepend-icon="mdi-simple-icons"
          ></v-select>
        </v-col>
      </v-row>
      <v-textarea
        v-model="post.body"
        outlined
        label="Body"
        required
        prepend-icon="mdi-subtitles-outline"
      >{{ compPrevPost.body }} 
      </v-textarea>
      <v-row>
        <v-col cols="12" md="6">
          <v-file-input
            v-model="post.images"
            accept="image/png, image/jpeg, image/jpg"
            counter
            label="Images"
            multiple
            placeholder="Select images"
            prepend-icon="mdi-camera"
          >
            <template v-slot:selection="{ index, text }">
              <v-chip
                v-if="index < 2"
                color=""
                dark
                label
                small
              > {{ text }} 
              </v-chip>
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="12" md="5">
          <v-combobox
            v-model="post.refs"
            multiple
            chips
            label="References"
            placeholder="Enter references by ID"
            prepend-icon="mdi-feather"
          ></v-combobox>
        </v-col>
      </v-row>
      <v-switch 
        v-model="post.published"
        label="Publish?"
      ></v-switch>
      <v-btn
        class="indigo darken-1 white--text"
        type="submit"
      >Submit
      </v-btn>
    </v-form>
  </v-container>
</template>

<script lang="ts">
  import Vue, { PropType } from 'vue'
  import { mapGetters } from 'vuex'

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
    props: {
      prevPost: {
        type: Object as PropType<Post>,
        required: false,
      },
    },
    data: () => ({
      post: {
        title: '',
        author: '',
        iconName: '',
        category: '',
        body: '',
        images: [],
        refs: [],
        published: true
      }
    }),
    computed: {
      ...mapGetters([
        'postCategories',
        'iconNames'
      ]),
      compPrevPost: function() {
        return this.prevPost || this.post
      }
    },
    methods: {
      dispatch: function() {
        this.post.category = this.post.category.toLowerCase()
        this.$emit('submit', this.post)
      }
    }
  })
</script>