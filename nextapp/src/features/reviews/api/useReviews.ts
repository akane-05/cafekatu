import apiClient from '@/lib/axios'
import useSWR from 'swr'
import { reqPath } from '@/const/Consts'
import { strage } from '@/const/Consts'

export function useReviews(page: number, perPage: number, id: any) {
  const fetcher = (url: string) =>
    apiClient
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
        },
      })
      .then((res) => res.data)

  const {
    data: data,
    error,
    mutate,
  } = useSWR(
    reqPath('cafeReviews', String(id)) +
      '?' +
      new URLSearchParams({
        per_page: `${perPage}`,
        page: `${page}`,
      }),
    fetcher,
    {
      revalidateOnMount: true,
      onErrorRetry: (error) => {
        // 401でトークンを削除
        if (error.response && error.response.status == 401) {
          localStorage.removeItem(strage.Token)
        }
      },
    },
  )

  return {
    response: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  }
}
