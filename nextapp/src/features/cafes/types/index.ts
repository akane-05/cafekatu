export type Cafe = {
  id?: number
  name: string
  zipcode: string
  prefecture_id: number
  city: string
  street: string
  business_hours: string
  approved?: number
  deleted?: number
  created_at?: string
  updated_at?: string
}

export type CafeInfo = {
  id: number
  name: string
  prefecture_id: number
  prefecture: string
  city: string
  street: string
  business_hours: string
  created_at: string
  updated_at: string
  rating: number
  is_favorite: boolean
}

export type CafesRes = {
  message?: string
  status?: number
  error?: string
}
