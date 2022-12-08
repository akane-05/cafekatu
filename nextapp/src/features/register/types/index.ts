import { BasicRes } from '@/features/index'

export type UserRgsRes = BasicRes & {
  token?: string
  id?: number
  nickname?: string
  email?: string
}

export type UserRgsInfo = {
  nickname: string
  email: string
  password: string
}
