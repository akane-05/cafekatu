import { UserUpdInfo, UserUpdRes } from '@/features/users/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'
import { resolveHandler, errorHandler } from '@/features/index'

export async function updateUser(info: UserUpdInfo): Promise<UserUpdRes> {
  return apiClient
    .patch(requests.users, JSON.stringify(info), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const response = <UserUpdRes>resolveHandler(res)

      localStorage.setItem(strage.Token, response.token ? response.token : '')

      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
