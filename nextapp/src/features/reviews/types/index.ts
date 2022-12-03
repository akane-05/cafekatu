export type ReviewInfo = {
  id?: number
  user_id?: number
  nickname?: string
  cafe_id: number
  comment: string
  rating: number
  created_at?: string
  updated_at?: string
}

export type Review = {
  id: number
  user_id: number
  cafe_id: number
  comment: string
  rating: number
  created_at?: string
  updated_at?: string
}

export type ReviewsRes = {
  status: number
  message: string
  error: string
}
