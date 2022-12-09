import { AxiosResponse, AxiosError } from 'axios'
import { strage } from '@/const/Consts'

export type BasicRes = {
  status: number
  message?: string
  error?: string
}

export const resolveHandler = <T>(res: AxiosResponse<any, any>): T => {
  const { data } = res
  const response = JSON.parse(JSON.stringify(data)) as T
  return response
}

export const errorHandler = (error: AxiosError<any>): BasicRes => {
  let response: BasicRes
  if (error.response) {
    const { data } = error.response
    if (data.status == 401) {
      localStorage.removeItem(strage.Token)
    }
    response = JSON.parse(JSON.stringify(data)) as BasicRes
  } else {
    response = {
      status: 500,
      error: 'アクセスしようとしたページは表示できませんでした',
    }
  }
  return response
}
