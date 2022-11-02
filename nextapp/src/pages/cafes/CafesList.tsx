// import { NextPage } from 'next'
// import Router from 'next/router'
import { Paper, Grid, Button } from '@mui/material'
import React from 'react'
import CafeCard from '@/components/elements/CafeCard'
import CustomPaper from '@/components/layouts/CustomPaper'

import { CafeInfo } from '@/features/cafes/types'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useTest } from '@/features/cafes/api/getCafes'

export default function CafesList(search: string) {
  const { data } = useTest()
  const router = useRouter() //useRouterフックを定義して

  const handleTopPage = (path: string) => {
    router.push({
      pathname: path,
    })
  }

  // if (isLoading) {
  //   return <span>読み込み中...</span>
  // }

  // if (isError) {
  //   return (
  //     <>
  //       <span>エラーが発生しました</span>
  //       <Button
  //         variant="contained"
  //         color="primary"
  //         onClick={() => handleTopPage('/')}
  //       >
  //         Top画面に戻る
  //       </Button>
  //     </>
  //   )
  // }

  return (
    <CustomPaper>
      {data?.data.cafes.map((cafeInfo: CafeInfo) => {
        return <CafeCard key={cafeInfo.id} cafeInfo={cafeInfo} /> //keyを指定
      })}
    </CustomPaper>
  )
}
