import apiClient from '@/lib/axios'
import { UsersRes } from '@/features/users/types'
import { strage } from '@/const/Consts'
import { requests } from '@/const/Consts'

export async function deleteUser(): Promise<UsersRes> {
  return apiClient
    .delete(requests.users, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as UsersRes
      response.status = status
      return response
    })
    .catch((error) => {
      const { data, status } = error.response
      const response = JSON.parse(JSON.stringify(data)) as UsersRes
      response.status = status

      if (status == 200 || status == 401) {
        localStorage.removeItem(strage.Token)
      }

      return response
    })
}
