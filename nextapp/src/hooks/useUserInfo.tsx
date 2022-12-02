import { useRecoilValue } from 'recoil'
import { userInfoState } from '@/globalStates/userInfo'

export function useUserInfo() {
  const userInfo = useRecoilValue(userInfoState)

  return {
    userInfo,
  }
}
