import axios from 'axios'
import { reqPath } from '@/const/Consts'

const apiClient = axios.create({
  baseURL: reqPath('base'),
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

export default apiClient
