import apiClient from '@/lib/axios'
import { BasicResponse } from '@/features/index'
import { strage } from '@/const/Consts'
import { requests } from '@/const/Consts'
import { errorHandler } from '@/features/index'

export async function deleteUser(): Promise<BasicResponse> {
  return apiClient
    .delete(requests.users, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as BasicResponse
      response.status = status
      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
