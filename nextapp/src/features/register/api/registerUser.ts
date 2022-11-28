import { RegisterInfo, Response } from '@/features/register/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'

export async function registerUser(info: RegisterInfo): Promise<Response> {
  return apiClient
    .post(requests.register, JSON.stringify(info))
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
