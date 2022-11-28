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

export function useCafe(
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

  const { data: post, error } = useSWR(
    requests.cafeDeatil +
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
        console.log(error)
        console.log(error.response)
        // 401でトークンを削除
        if (error.response.status == 401) {
          setHaveToken(false)
          localStorage.removeItem(strage.Token)
        }
      },
    },
  )

  return {
    response: post,
    isLoading: !error && !post,
    isError: error,
  }
}
