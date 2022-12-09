import { BasicRes } from '@/features/index'

export type LoginRes = BasicRes & {
  id?: number
  nickname?: string
  email?: string
  token?: string
}

export type LoginInfo = {
  email?: string
  password?: string
}
