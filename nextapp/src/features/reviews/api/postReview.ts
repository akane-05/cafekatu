import { ReviewInfo, ReviewsRes } from '@/features/reviews/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'

export async function postReview(
  review: ReviewInfo,
  id: any,
): Promise<ReviewsRes> {
  const cafe_id = parseInt(id)
  review.cafe_id = cafe_id

  return apiClient
    .post(requests.reviews, JSON.stringify(review), {
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
