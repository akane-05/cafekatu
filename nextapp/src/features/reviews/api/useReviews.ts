import { CafeInfo } from '@/features/cafes/types'
import apiClient from '@/lib/axios'
import useSWR from 'swr'
import { requests } from '@/const/Consts'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { strage } from '@/const/Consts'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import { haveTokenState } from '@/globalStates/haveToken'
import { useHaveToken } from '@/hooks/useHaveToken'

export type fetchPostReturnType = {
  data: {
    cafes: CafeInfo[]
    message: string
  }
}

export function useReviews(
  page: number,
  perPage: number,
  param?: string | string[],
) {
  const setHaveToken = useSetRecoilState(haveTokenState)

  let id = ''
  if (typeof param === undefined) {
    return {
      response: null,
      isLoading: null,
      isError: 'パラメータが不適切です',
    }
  } else if (typeof param === 'string') {
    id = param
  } else if (Array.isArray(param)) {
    id = param[0]
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
    requests.reviews +
      id +
      '?' +
      new URLSearchParams({
        per_page: `${perPage}`,
        page: `${page}`,
      }),
    fetcher,
    {
      onErrorRetry: (error) => {
        if (error.message == 'Network Error') {
          return
        }
        // 401でトークンを削除
        if (error.response.status == 401) {
          setHaveToken(false)
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
