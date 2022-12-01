import apiClient from '@/lib/axios'
import { CafesRes } from '@/features/cafes/types'
import { strage } from '@/const/Consts'

export async function postFavorite(id: number): Promise<CafesRes> {
  return apiClient
    .post(`/cafes/${id}/favorite`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as CafesRes
      response.status = status
      return response
    })
    .catch((error) => {
      const { data, status } = error.response
      const response = JSON.parse(JSON.stringify(data)) as CafesRes
      response.status = status

      if (status == 401) {
        localStorage.removeItem(strage.Token)
      }

      return response
    })
}
