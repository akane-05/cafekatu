import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

// undefined : まだログイン確認が完了していない状態とする
// null      : ログイン確認をした結果、ログインしていなかった状態とする
export const haveTokenState = atom<undefined | null | boolean>({
  key: 'haveToken',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
})
