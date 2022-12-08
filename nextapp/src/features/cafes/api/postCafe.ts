import { CafeRgsInfo } from '@/features/cafes/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'
import { errorHandler } from '@/features/index'
import { BasicRes } from '@/features/index'

export async function postCafe(cafe: CafeRgsInfo): Promise<BasicRes> {
  return apiClient
    .post(requests.cafes, JSON.stringify(cafe), {
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
