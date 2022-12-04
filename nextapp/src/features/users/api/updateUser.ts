import { UpdateInfo, UpdateRes } from '@/features/users/types'
import apiClient from '@/lib/axios'
import { requests } from '@/const/Consts'
import { strage } from '@/const/Consts'
import Axios from 'axios'

export async function updateUser(info: UpdateInfo): Promise<UpdateRes> {
  return apiClient
    .patch(requests.users, JSON.stringify(info), {
      headers: {
        Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
      },
    })
    .then((res) => {
      const { data, status } = res
      const response = JSON.parse(JSON.stringify(data)) as UpdateRes
      response.status = status
      localStorage.setItem(strage.Token, response.token ? response.token : '')

      return response
    })
    .catch((error) => {
      let response: UpdateRes
      if (error?.message == 'Network Error') {
        response = {
          status: 404,
          error: '指定されたページが見つかりません。',
        }
        return response
      }

      const { data, status } = error.response
      response = JSON.parse(JSON.stringify(data)) as UpdateRes
      response.status = status

      if (status == 401) {
        localStorage.removeItem(strage.Token)
      }

      return response

      // const { data, status } = error.response
      // const response = JSON.parse(JSON.stringify(data)) as UpdateRes
      // response.status = status

      // if (status == 401) {
      //   localStorage.removeItem(strage.Token)
      // }

      // return response
    })
}
