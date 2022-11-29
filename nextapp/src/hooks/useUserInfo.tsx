import { useRecoilValue } from 'recoil'
import { userInfoState } from '@/globalStates/userInfo'

export function useUserInfo() {
  const nickname = useRecoilValue(userInfoState)

  return {
    nickname,
  }
}
