import apiClient from '@/lib/axios'
import useSWR from 'swr'
import { reqPath } from '@/const/Consts'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { strage } from '@/const/Consts'

export function useUser(id: any) {
  const fetcher = (url: string) =>
    apiClient
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
        },
      })
      .then((res) => res.data)

  const { data: data, error } = useSWR(
    id ? reqPath('user', String(id)) : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
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
  }
}
