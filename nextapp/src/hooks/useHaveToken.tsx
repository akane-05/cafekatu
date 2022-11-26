import { useRecoilValue } from 'recoil'
import { haveTokenState } from '@/globalStates/haveToken'

export function useHaveToken() {
  const haveToken = useRecoilValue(haveTokenState)
  const isAuthChecking = haveToken === undefined

  return {
    haveToken,
    isAuthChecking,
  }
}
