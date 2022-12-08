import { ReviewInfo } from '@/features/reviews/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'
import { BasicResponse } from '@/features/index'
import { errorHandler } from '@/features/index'

export async function postReview(
  review: ReviewInfo,
  id: any,
): Promise<BasicResponse> {
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
      const response = JSON.parse(JSON.stringify(data)) as BasicResponse
      response.status = status

      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
