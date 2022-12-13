import apiClient from '@/lib/axios'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { strage, reqPath } from '@/const/Consts'

export function useCafes(page: number, perPage: number, param?: any) {
  const searchWord = param ? param : ''

  const fetcher = (url: string) =>
    apiClient
      .get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(strage.Token)}`,
        },
      })
      .then((res) => res.data)

  const { data: data, error } = useSWR(
    reqPath('cafes') +
      '?' +
      new URLSearchParams({
        per_page: String(perPage),
        page: String(page),
        search_word: searchWord,
      }),
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
