export type RegisterInfo = {
  email: string
  password: string
  nickname: string
}

export type RegisterRes = {
  status: number
  message: string
  token: string
  nickname: string
  error: string
}
