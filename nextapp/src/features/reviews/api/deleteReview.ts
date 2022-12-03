import apiClient from '@/lib/axios'
import { ReviewsRes } from '@/features/reviews/types'
import { strage } from '@/const/Consts'
import { requests } from '@/const/Consts'

export async function deleteReview(id: number): Promise<ReviewsRes> {
  return apiClient
    .delete(requests.reviews + '/' + id, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as ReviewsRes
      response.status = status
      return response
    })
    .catch((error) => {
      const { data, status } = error.response
      const response = JSON.parse(JSON.stringify(data)) as ReviewsRes
      response.status = status

      if (status == 401) {
        localStorage.removeItem(strage.Token)
      }

      return response
    })
}
