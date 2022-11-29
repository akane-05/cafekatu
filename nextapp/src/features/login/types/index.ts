export type LoginInfo = {
  email?: string
  password?: string
}

export type Response = {
  status: number
  message: string
  token: string
  nickname: string
  error: string

  id: number
  email: string
}
