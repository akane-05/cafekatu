import { useQuery } from 'react-query'

import { Cafe } from '@/features/cafes/types'
import { APIClient } from '@/lib/axios'

// import { ExtractFnReturnType, QueryConfig } from '@/lib/react-query'

export const getCafes = (): Promise<Cafe[]> => {
  return APIClient.get('/cafes')
}

// type QueryFnType = typeof getCafes

// type UseCafesOptions = {
//   config?: QueryConfig<QueryFnType>
// }

// export const useCafes = ({ config }: UseCafesOptions = {}) => {
//   return useQuery<ExtractFnReturnType<QueryFnType>>({
//     ...config,
//     queryKey: ['cafes'],
//     queryFn: () => getCafes(),
//   })
// }

export const useCafes = () => {
  return useQuery('cafes', () => getCafes())
}
