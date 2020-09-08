import bcrypt from 'bcryptjs'
import { ApiService } from '@/services/api.service'
import { TokenService } from '@/services/storage.service'

class AuthenticationError extends Error {
  constructor(errorCode: any, message: string) {
    super(message)
    this.name = this.constructor.name
    this.message = message
  }
}

const UserService = {
  login: async function(username: string, password: string) {
    const saltRounds = 10
    password = await new Promise((resolve: any, reject: any) => {
      bcrypt.hash(password, saltRounds, function(error, hash) {
        if (error) reject(error)
        resolve(hash)
      })
    })
    const requestData = {
      method: 'post',
      url: 'login',
      data: {
        grant_type: 'password',
        username,
        password,
      },
      auth: {
        username: process.env.VUE_APP_CLIENT_ID,
        password: process.env.VUE_APP_CLIENT_SECRET
      }
    }
    try {
      const response = await ApiService.customRequest(requestData)

      TokenService.saveToken(response.data.access_token)
      TokenService.saveRefreshToken(response.data.refresh_token)
      ApiService.setHeader()
      ApiService.mount401Interceptor()

      return response.data.access_token
    } catch (error) {
      throw new AuthenticationError(error.response.status, error.response.data.detail)
    }
  },

  refreshToken: async function() {
    const refreshToken = TokenService.getRefreshToken()
    const requestData = {
      method: 'post',
      url: 'token',
      data: {
        grant_type: 'refresh_token',
        refreshToken
      },
      auth: {
        username: process.env.VUE_APP_CLIENT_ID,
        password: process.env.VUE_APP_CLIENT_SECRET
      }
    }

    try {
      const response = await ApiService.customRequest(requestData)

      TokenService.saveToken(response.data.access_token)
      TokenService.saveRefreshToken(response.data.refresh_token)
      ApiService.setHeader()

      return response.data.access_token
    } catch (error) {
      throw new AuthenticationError(error.response.status, error.response.data.detail)
    }
  },

  logout() {
    TokenService.removeToken()
    TokenService.removeRefreshToken()
    ApiService.removeHeader()
    ApiService.unmount401Interceptor()
  }
}

export default UserService

export { UserService, AuthenticationError }