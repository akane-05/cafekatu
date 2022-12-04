import { Cafe, CafesRes } from '@/features/cafes/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'

export async function postCafe(cafe: Cafe): Promise<CafesRes> {
  return apiClient
    .post(requests.cafes, JSON.stringify(cafe), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const { data, status } = res
      console.log(data)
      console.log(status)
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
