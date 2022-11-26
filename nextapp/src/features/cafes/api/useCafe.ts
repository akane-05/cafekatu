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

export function useCafe(
  page: number,
  perPage: number,
  param?: string | string[],
) {
  let id = ''
  if (typeof param === undefined) {
    //id = ''
    //returnでは
  } else if (typeof param === 'string') {
    id = param
  } else if (Array.isArray(param)) {
    id = param[0]
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
    requests.cafeDeatil +
      id +
      '?' +
      new URLSearchParams({
        per_page: `${perPage}`,
        page: `${page}`,
      }),
    fetcher,
  )

  return {
    response: post,
    isLoading: !error && !post,
    isError: error,
  }
}
