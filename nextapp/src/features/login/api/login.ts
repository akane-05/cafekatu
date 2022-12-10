import { LoginInfo, LoginRes } from '@/features/login/types'
import apiClient from '@/lib/axios'
import { reqPath } from '@/const/Consts'
import { strage } from '@/const/Consts'
import { resolveHandler, errorHandler } from '@/features/index'

export async function login(info: LoginInfo): Promise<LoginRes> {
  return apiClient
    .post(reqPath('login'), JSON.stringify(info))
    .then((res) => {
      const response = <LoginRes>resolveHandler(res)
      localStorage.setItem(strage.Token, response.token ? response.token : '')

      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
