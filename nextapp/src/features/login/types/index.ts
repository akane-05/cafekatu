import { BasicResponse } from '@/features/index'

export type LoginRes = BasicResponse & {
  id?: number
  nickname?: string
  email?: string
  token?: string
}

export type LoginInfo = {
  email?: string
  password?: string
}
