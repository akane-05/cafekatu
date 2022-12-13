import { strage } from '@/const/Consts'

export function logout(): void {
  localStorage.removeItem(strage.Token)
  return
}
