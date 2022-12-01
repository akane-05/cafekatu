import { RegisterInfo, RegisterRes } from '@/features/register/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'

export async function registerUser(info: RegisterInfo): Promise<RegisterRes> {
  return apiClient
    .post(requests.register, JSON.stringify(info))
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as RegisterRes
      response.status = status
      localStorage.setItem(strage.Token, response.token)

      return response
    })
    .catch((error) => {
      const { data, status } = error.response
      const response = JSON.parse(JSON.stringify(data)) as RegisterRes
      response.status = status

      return response
    })
}
