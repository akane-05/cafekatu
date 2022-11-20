export type RegisterInfo = {
    email: string
    password: string
    nickname: string
  }

export type Response = {
  status:number
  message:string
  token:string
  error: string
  }
