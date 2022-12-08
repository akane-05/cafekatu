import { LoginInfo, LoginRes } from '@/features/login/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'
import { errorHandler } from '@/features/index'

export async function login(info: LoginInfo): Promise<LoginRes> {
  return apiClient
    .post(requests.login, JSON.stringify(info))
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as LoginRes
      response.status = status

      localStorage.setItem(strage.Token, response.token ? response.token : '')

      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
