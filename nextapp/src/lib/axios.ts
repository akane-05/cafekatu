import axios from 'axios'
import {requests} from '@/const/Consts'

const APIClient = axios.create({
  baseURL: requests.base,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

export default APIClient
