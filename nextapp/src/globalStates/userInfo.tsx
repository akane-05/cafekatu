import { atom } from 'recoil'

// undefined : まだログイン確認が完了していない状態とする
// null      : ログイン確認をした結果、ログインしていなかった状態とする
export const userInfoState = atom<undefined | string>({
  key: 'userInfo',
  default: undefined,
})
