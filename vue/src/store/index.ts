import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import bcrypt from 'bcrypt'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('user-token') || '',
    articles: require('@/data/articles.json'),
    drawer: false,
    iconNames: ['Philosophy', 'Anecdote', 'Science', 'Anthropology'],
    postCategories: ['Idea', 'Journal', 'Tech'],
    items: [
      {
        text: 'Home',
        href: '#!',
      },
      {
        text: 'About',
        href: '#about',
      },
    ],
    posts: [],
  },
  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    iconNames: state => state.iconNames,
    postCategories: state => state.postCategories,
    categories: state => {
      const categories: any = []

      for (const article of state.articles) {
        if (
          !article.category ||
          categories.find((category: any) => category.text === article.category)
        ) continue

        const text = article.category

        categories.push({
          text,
          href: '#!',
        })
      }

      return categories.sort().slice(0, 4)
    },
    links: (state, getters) => {
      return state.items.concat(getters.categories)
    },
  },
  mutations: {
    savePosts: (state, payload) => (state.posts = payload),
    setDrawer: (state, payload) => (state.drawer = payload),
    toggleDrawer: state => (state.drawer = !state.drawer),
    authRequest: state => (state.status = 'authenticating'),
    authSuccess: (state, payload) => {
      state.status = 'success'
      state.token = payload
    },
    authError: state => (state.status = 'error')
  },
  actions: {
    loadPosts({commit}) {
      axios.get('http://localhost:8000/posts').then(result => {
        commit('savePosts', result.data)
      }).catch(error => {
        throw new Error(`API ${error}`)
      })
    },
    authRequest({ commit, dispatch }, user) {
      return new Promise((resolve, reject) => {
        commit('authRequest')
        axios.post('auth', { user })
          .then(response => {
            const token = response.data.token
            localStorage.setItem('user-token', token)
            commit('authSuccess', token)
            dispatch('login')
            resolve(response)
          })
          .catch(error => {
            commit('authError', error)
            localStorage.removeItem('user-token')
            reject(error)
          })
      })
    },
    authLogout({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        commit('authLogout')
        localStorage.removeItem('user-token')
        delete axios.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  modules: {
  }
})
