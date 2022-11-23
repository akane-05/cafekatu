import apiClient from '@/lib/axios'
import { Response } from '@/features/cafes/types'

export async function postFavorite(id: number): Promise<Response> {
  return apiClient
    .post(`/cafes/${id}/favorite`, null, {
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
