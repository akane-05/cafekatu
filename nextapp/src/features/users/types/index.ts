import { CafeInfo } from '@/features/cafes/types'
import { Review } from '@/features/reviews/types'

export type UsersRes = {
  message: string
  status: number
  error: string
}

export type PastPost = {
  cafeInfo: CafeInfo
  reviews: Review[]
}
