import { CafeInfo } from '@/features/cafes/types'
import apiClient from '@/lib/axios'
import useSWR from 'swr'
import { requests } from '@/const/Consts'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { strage } from '@/const/Consts'

export function useCafe(id: any) {
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
  } = useSWR(id ? requests.cafes + '/' + id : null, fetcher, {
    onErrorRetry: (error) => {
      if (error.message == 'Network Error') {
        return
      }
      // 401でトークンを削除
      if (error.response.status == 401) {
        localStorage.removeItem(strage.Token)
      }
    },
  })

  return {
    response: data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  }
}
