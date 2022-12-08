import { UserRgsInfo, UserRgsRes } from '@/features/register/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'
import { errorHandler } from '@/features/index'

export async function registerUser(info: UserRgsInfo): Promise<UserRgsRes> {
  return apiClient
    .post(requests.register, JSON.stringify(info))
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as UserRgsRes
      response.status = status

      localStorage.setItem(strage.Token, response.token ? response.token : '')

      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
