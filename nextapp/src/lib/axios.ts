import axios from 'axios'
import {requests} from '@/const/Consts'
import { isLoggedIn, setAuthTokens, clearAuthTokens, getAccessToken, getRefreshToken } from 'axios-jwt'


const apiClient = axios.create({
  baseURL: requests.base,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

export default apiClient

// Get access to tokens
export const accessToken = getAccessToken()
export const refreshToken = getRefreshToken()
