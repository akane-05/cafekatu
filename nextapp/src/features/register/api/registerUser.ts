import { UserRgsInfo, UserRgsRes } from '@/features/register/types'
import apiClient from '@/lib/axios'
import { reqPath, strage } from '@/const/Consts'
import { resolveHandler, errorHandler } from '@/features/index'

export async function registerUser(info: UserRgsInfo): Promise<UserRgsRes> {
  return apiClient
    .post(reqPath('register'), JSON.stringify(info))
    .then((res) => {
      const response = <UserRgsRes>resolveHandler(res)
      localStorage.setItem(strage.Token, response.token ? response.token : '')

      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
