import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

export type UserInfo = {
  id?: number
  nickname?: string
  email?: string
}

const { persistAtom } = recoilPersist()

export const userInfoState = atom<undefined | UserInfo>({
  key: 'userInfo',
  default: undefined,
  effects_UNSTABLE: [persistAtom],
})
