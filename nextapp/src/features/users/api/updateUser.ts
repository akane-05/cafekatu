import { UserUpdInfo, UserUpdRes } from '@/features/users/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'
import { errorHandler } from '@/features/index'

export async function updateUser(info: UserUpdInfo): Promise<UserUpdRes> {
  return apiClient
    .patch(requests.users, JSON.stringify(info), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as UserUpdRes
      response.status = status

      localStorage.setItem(strage.Token, response.token ? response.token : '')

      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
