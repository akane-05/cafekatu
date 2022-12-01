export type LoginInfo = {
  email?: string
  password?: string
}

export type LoginRes = {
  status: number
  message: string
  token: string
  nickname: string
  error: string

  id: number
  email: string
}
