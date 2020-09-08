import axios from 'axios'
import store from '@/store'
import { TokenService } from '@/services/storage.service'

const ApiService = {
    _401interceptor: 0,

    mount401Interceptor() {
        this._401interceptor = axios.interceptors.response.use(
            (response: any) => {
                return response
            },
            async (error) => {
                if (error.request.status == 401) {
                    if (error.config.url.includes('token')) {
                        store.dispatch('auth/logout')
                        throw error
                    } else {
                        try {
                            await store.dispatch('auth/refreshToken')

                            return this.customRequest({
                                method: error.config.method,
                                url: error.config.url,
                                data: error.config.data,
                            })
                        } catch (refreshError) {
                            throw refreshError
                        }
                    }
                }
                throw error
            }
        )
    },

    unmount401Interceptor() {
        axios.interceptors.response.eject(this._401interceptor)
    },

    init(baseUrl: string) {
        axios.defaults.baseURL = baseUrl
    },
    setHeader() {
        axios.defaults.headers.common['Authorization'] = `Bearer ${TokenService.getToken}`
    },
    removeHeader() {
        axios.defaults.headers.common = {}
    },
    get(resource: any) {
        return axios.get(resource)
    },
    post(resource: any, data: any) {
        return axios.post(resource, data)
    },
    put(resource: any, data: any) {
        return axios.put(resource, data)
    },
    delete(resource: any) {
        return axios.delete(resource)
    },
    customRequest(data: any) {
        return axios(data)
    }
}

export { ApiService }