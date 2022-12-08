import { AxiosError } from 'axios'
import { strage } from '@/const/Consts'

export type BasicResponse = {
  status: number
  message?: string
  error?: string
}

export const errorHandler = (error: AxiosError<any>) => {
  let response: BasicResponse
  if (error.response) {
    const { data, status } = error.response
    if (status == 401) {
      localStorage.removeItem(strage.Token)
    }
    response = JSON.parse(JSON.stringify(data)) as BasicResponse
    response.status = status
  } else {
    response = {
      status: 500,
      error: 'アクセスしようとしたページは表示できませんでした',
    }
  }
  return response
}
