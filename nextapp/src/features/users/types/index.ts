import { CafeInfo } from '@/features/cafes/types'
import { Review } from '@/features/reviews/types'

// export type ErrorRes = {
//   status: number
//   error: string
// }

export type UsersRes = {
  message: string
  status: number
  error: string
}

export type PastPost = {
  cafeInfo: CafeInfo
  reviews: Review[]
}

export type UpdateInfo = {
  nickname: string
  email: string
  password: string
  // newPassword: string
  // newPasswordConfirm: string
}

export type UpdateRes = {
  status: number
  message?: string
  token?: string
  id?: number
  nickname?: string
  email?: string
  error: string
}
