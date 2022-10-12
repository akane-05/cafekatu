// import { NextPage } from 'next'
// import Router from 'next/router'
import { Paper, Grid, Button } from '@mui/material'
import React from 'react'
import CafeCard from '@/components/elements/CafeCard'
import CustomPaper from '@/components/layouts/CustomPaper'

import { useCafes } from '@/features/cafes/api/getCafes'
import { CafeInfo } from '@/features/cafes/types'
import { useRouter } from 'next/router'

export default function CafesList() {
  const { data, isLoading, isError, error } = useCafes()
  const router = useRouter() //useRouterフックを定義して

  const handleTopPage = (path: string) => {
    router.push({
      pathname: path,
    })
  }
  // console.log(cafesQuery)
  // const { data, isLoading } = useCafes()

  if (isLoading) {
    return <span>読み込み中...</span>
  }

  if (isError) {
    // return <span>Error: {error.message}</span>
    return (
      <>
        <span>エラーが発生しました</span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleTopPage('/')}
        >
          Top画面に戻る
        </Button>
      </>
    )
  }

  return (
    <CustomPaper>
      {/* {data.cafes.Count() == 0 ? (
        <>
          検索条件に一致する店舗が存在しません
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleTopPage('/')}
          >
            Top画面に戻る
          </Button>
        </>
      ) : (
        data.cafes.map((cafeInfo: CafeInfo) => {
          return <CafeCard key={cafeInfo.id} cafeInfo={cafeInfo} /> //keyを指定
        })
      )} */}

{
        data.cafes.map((cafeInfo: CafeInfo) => {
          return <CafeCard key={cafeInfo.id} cafeInfo={cafeInfo} /> //keyを指定
        })
      }
      
    </CustomPaper>

    // <CustomPaper>

    //   {/* {data.cafes.map((cafeInfo: CafeInfo) => {
    //     return <CafeCard key={cafeInfo.id} cafeInfo={cafeInfo} /> //keyを指定
    //   })} */}
    // </CustomPaper>
  )
}
