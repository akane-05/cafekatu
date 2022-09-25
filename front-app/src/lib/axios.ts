import axios from 'axios'

export const APIClient = axios.create({
  baseURL: 'http://localhost:8080',
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: true,
})
