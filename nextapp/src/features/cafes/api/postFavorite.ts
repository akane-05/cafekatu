import apiClient from '@/lib/axios'
import { strage } from '@/const/Consts'
import { BasicRes } from '@/features/index'
import { errorHandler } from '@/features/index'

export async function postFavorite(id: number): Promise<BasicRes> {
  return apiClient
    .post(`/cafes/${id}/favorite`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as BasicRes
      response.status = status
      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
