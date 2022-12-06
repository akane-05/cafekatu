import { CafeInfo } from '@/features/cafes/types'
import apiClient from '@/lib/axios'
import useSWR from 'swr'
import { requests } from '@/const/Consts'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { strage } from '@/const/Consts'

export type fetchPostReturnType = {
  data: {
    cafes: CafeInfo[]
    message: string
  }
}

export function useCafes(
  page: number,
  perPage: number,
  param?: string | string[],
) {
  let searchWord = ''
  if (typeof param === undefined) {
    searchWord = ''
  } else if (typeof param === 'string') {
    searchWord = param
  } else if (Array.isArray(param)) {
    searchWord = param[0]
  }
  const fetcher = (url: string) =>
    apiClient
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
        },
      })
      .then((res) => res.data)

  const { data: data, error } = useSWR(
    requests.cafes +
      '?' +
      new URLSearchParams({
        per_page: `${perPage}`,
        page: `${page}`,
        search_word: searchWord,
      }),
    fetcher,
    {
      // revalidateIfStale: true,
      revalidateOnMount: true,
      // revalidateOnFocus: true,
      onErrorRetry: (error) => {
        if (error.message == 'Network Error') {
          return
        }
        // 401でトークンを削除
        if (error.response.status == 401) {
          localStorage.removeItem(strage.Token)
        }
      },
    },
  )

  return {
    response: data,
    isLoading: !error && !data,
    isError: error,
  }
}
