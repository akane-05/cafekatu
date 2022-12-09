import { ReviewInfo } from '@/features/reviews/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'
import { BasicRes } from '@/features/index'
import { resolveHandler, errorHandler } from '@/features/index'

export async function postReview(
  review: ReviewInfo,
  id: any,
): Promise<BasicRes> {
  const cafe_id = parseInt(id)
  review.cafe_id = cafe_id

  return apiClient
    .post(requests.reviews, JSON.stringify(review), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const response = <BasicRes>resolveHandler(res)
      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
