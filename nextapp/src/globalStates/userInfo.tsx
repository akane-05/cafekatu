import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const userInfoState = atom<undefined | string>({
  key: 'userInfo',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
})
