import apiClient from '@/lib/axios'
import { BasicRes } from '@/features/index'
import { strage, reqPath } from '@/const/Consts'
import { resolveHandler, errorHandler } from '@/features/index'

export async function deleteUser(id: any): Promise<BasicRes> {
  return apiClient
    .delete(reqPath('user', String(id)), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const response = <BasicRes>resolveHandler(res)

      localStorage.removeItem(strage.Token)
      return response
    })
    .catch((error) => {
      return errorHandler(error)
    })
}
