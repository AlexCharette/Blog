import { UserService, AuthenticationError } from '@/services/user.service'
import { TokenService } from '@/services/storage.service'
import router from '@/router'

const state = {
    authenticating: false,
    accessToken: TokenService.getToken(),
    AuthenticationError: '',
    refreshTokenPromise: null,
}

const getters = {
    loggedIn: (state: Record<string, any>) => {
        return state.accessToken ? true : false
    },
    authenticationError: (state: Record<string, any>) => {
        return state.authenticationError
    },
    authenticating: (state: Record<string, any>) => {
        return state.authenticating
    },
}

const mutations = {
    loginRequest(state: Record<string, any>) {
        state.authenticating = true
        state.authenticationError = ''
    },
    loginSuccess(state: Record<string, any>, accessToken: string) {
        state.accessToken = accessToken
        state.authenticating = false
    },
    loginError(state: Record<string, any>, { errorMessage }: { errorMessage: string }) {
        state.authenticating = false
        state.authenticationError = errorMessage
    }, 
    logoutSuccess(state: Record<string, any>) {
        state.accessToken = ''
    },
    refreshTokenPromise(state: Record<string, any>, promise: any) {
        state.refreshTokenPromise = promise
    },
}

const actions = {
    async login({ commit }: { commit: Function }, { username, password }: { username: string; password: string }) {
        commit('loginRequest')

        try {
            // TODO encrypt?
            const token = await UserService.login(username, password)

            commit('loginSuccess', token)
            // @ts-ignore
            router.push(router.history.current.query.redirect || '/')

            return true
        } catch (error) {
            if (error instanceof AuthenticationError) {
                commit('loginError', { errorMessage: error.message })
            }
        }
    },
    logout({ commit }: { commit: Function }) {
        UserService.logout()
        commit('logoutSuccess')
        router.push('/admin-login')
    },
    refreshToken({ commit, state }: { commit: Function; state: Record<string, any> }) {
        if (!state.refreshTokenPromise) {
            const promise = UserService.refreshToken()

            commit('refreshTokenPromise', promise)
            promise.then(
                response => {
                    commit('refreshTokenPromise', null)
                    commit('loginSuccess', response)
                },
                error => {
                    commit('refreshTokenPromise', null)
                }
            )
        }
        return state.refreshTokenPromise
    },
}

export const auth = {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}