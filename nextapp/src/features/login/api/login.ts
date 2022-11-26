import { LoginInfo, Response } from '@/features/login/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'

export async function login(info: LoginInfo): Promise<Response> {
  return apiClient
    .post(requests.login, JSON.stringify(info))
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as Response
      response.status = status
      localStorage.setItem(strage.Token, response.token)

      return response
    })
    .catch((error) => {
      const { data, status } = error.response
      const response = JSON.parse(JSON.stringify(data)) as Response
      response.status = status
      return response
    })
}
