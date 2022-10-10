import { useQuery } from 'react-query'

import { CafeInfo } from '@/features/cafes/types'
import { APIClient } from '@/lib/axios'
import { AxiosRequestConfig, AxiosResponse } from 'axios'

export const useCafes = () => {
  return useQuery('cafes', () => getCafes())
}

export const getCafes = async () => {
  const options: AxiosRequestConfig = {
    url: `cafes`,
    method: 'GET',
  }

  const res = await APIClient(options)
  return res.data
}

export const useCafe = (id: string) => {
  return useQuery('cafe', () => getCafe(id))
}

export const getCafe = async (id: string) => {
  const options: AxiosRequestConfig = {
    url: `cafes`,
    method: 'GET',
    params: {
      id: id,
    },
  }

  const res = await APIClient(options)
  return res.data
}

//   await APIClient(options).then((res: AxiosResponse<CafeInfo[]>) => {
//     const { data, status } = res
//     return data
//   })
// }

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
