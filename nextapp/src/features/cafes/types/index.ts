export type CafeRgsInfo = {
  name: string
  zipcode: string
  prefecture_id: number
  city: string
  street: string
  business_hours: string
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
