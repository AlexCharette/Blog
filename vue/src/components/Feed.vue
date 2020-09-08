<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <slot />
      </v-col>

      <feed-card
        v-for="(post, i) in paginatedPosts"
        :key="post.title"
        :size="layout[i]"
        :value="post"
      />
    </v-row>

    <v-row align="center">
      <v-col cols="3">
        <base-btn
          v-if="page !== 1"
          class="ml-0"
          square
          title="Previous page"
          @click="page--"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </base-btn>
      </v-col>

      <v-col
        class="text-center subheading"
        cols="6"
      >
        PAGE {{ page }} OF {{ pages }}
      </v-col>

      <v-col
        class="text-right"
        cols="3"
      >
        <base-btn
          v-if="pages > 1 && page < pages"
          class="mr-0"
          square
          title="Next page"
          @click="page++"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </base-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  // Utilities
  import {
    mapState,
  } from 'vuex'

  export default {
    name: 'Feed',
    components: {
      FeedCard: () => import('@/components/FeedCard'),
    },
    data: () => ({
      layout: [2, 2, 1, 2, 2, 3, 3, 3, 3, 3, 3],
      page: 1,
    }),
    computed: {
      ...mapState(['articles', 'posts']),
      pages () {
        return Math.max(Math.ceil(this.posts.length / 11), 1)
      },
      paginatedPosts () {
        const start = (this.page - 1) * 11
        const stop = this.page * 11

        return this.posts.slice(start, stop)
      },
    },
    watch: {
      page () {
        window.scrollTo(0, 0)
      },
    },
    mounted: function() {
      this.$store.dispatch('loadPosts')
    }
  }
</script>
