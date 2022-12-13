import { CafeRgsInfo } from '@/features/cafes/types'
import apiClient from '@/lib/axios'
import { strage, reqPath } from '@/const/Consts'
import { resolveHandler, errorHandler } from '@/features/index'
import { BasicRes } from '@/features/index'

export async function postCafe(cafe: CafeRgsInfo): Promise<BasicRes> {
  return apiClient
    .post(reqPath('cafes'), JSON.stringify(cafe), {
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
