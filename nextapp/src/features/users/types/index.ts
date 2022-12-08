import { BasicResponse } from '@/features/index'

export type UserUpdRes = BasicResponse & {
  token?: string
  id?: number
  nickname?: string
  email?: string
  address?: string
}

export type UserUpdInfo = {
  nickname: string
  email: string
  password: string
  // newPassword: string
  // newPasswordConfirm: string
}
