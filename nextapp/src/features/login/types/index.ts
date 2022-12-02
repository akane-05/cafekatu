export type LoginInfo = {
  email?: string
  password?: string
}

export type LoginRes = {
  status: number
  message: string
  token: string
  id: number
  nickname: string
  email: string
  error: string
}
