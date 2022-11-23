import { CafeInfo } from '@/features/cafes/types'
import apiClient from '@/lib/axios'
import useSWR from 'swr'
import { requests } from '@/const/Consts'
// import { useToken } from '@/hooks/useToken'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

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
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => res.data)

  const { data: post, error } = useSWR(
    requests.cafes +
      new URLSearchParams({
        per_page: `${perPage}`,
        page: `${page}`,
        search_word: searchWord,
      }),
    fetcher,
  )

  return {
    response: post,
    isLoading: !error && !post,
    isError: error,
  }
}
