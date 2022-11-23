import apiClient from '@/lib/axios'
import { Response } from '@/features/cafes/types'

export async function deleteFavorite(id: number): Promise<Response> {
  return apiClient
    .delete(`/cafes/${id}/favorite`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as Response
      response.status = status
      return response
    })
    .catch((error) => {
      const { data, status } = error.response
      const response = JSON.parse(JSON.stringify(data)) as Response
      response.status = status
      return response
    })
}
