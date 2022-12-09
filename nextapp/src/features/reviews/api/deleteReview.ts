import apiClient from '@/lib/axios'
import { BasicRes } from '@/features/index'
import { strage } from '@/const/Consts'
import { requests } from '@/const/Consts'
import { resolveHandler, errorHandler } from '@/features/index'

export async function deleteReview(id: number): Promise<BasicRes> {
  return apiClient
    .delete(requests.reviews + '/' + id, {
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
