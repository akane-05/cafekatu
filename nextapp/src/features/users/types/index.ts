import { BasicRes } from '@/features/index'

export type UserUpdRes = BasicRes & {
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
