// import { NextPage } from 'next'
// import Router from 'next/router'
import { Paper, Grid, Button } from '@mui/material'
import React from 'react'
import CafeCard from '@/components/elements/CafeCard'
import CustomPaper from '@/components/layouts/CustomPaper'
import Router from 'next/router'
import { CafeInfo } from '@/features/cafes/types'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getCafes } from '@/features/cafes/api/getCafes'
import * as Dialog from '@/context/MessageDialog'
import { path } from '@/const/Consts'
import { ContactMailOutlined } from '@mui/icons-material'

// import { info } from 'console'

export default function CafesList(search: string) {
  const [cafes, setCafes] = useState<CafeInfo[]>([])
  const dialog = Dialog.useDialogContext()

  //初回レンダリングのみ実行
  useEffect(() => {
    ;(async () => {
      const returnInfo = await getCafes()
      if (returnInfo.status == 200) {
        setCafes(returnInfo.data)
      } else {
        await dialog
          .confirm(Dialog.apiErrorDialog(returnInfo.status, returnInfo.error))
          .then(() => {
            handleLink(path.top)
          })
      }
    })()
  }, [])

  const handleLink = (path: string) => {
    Router.push(path)
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
      {cafes?.map((cafeInfo: CafeInfo) => {
        return <CafeCard key={cafeInfo.id} cafeInfo={cafeInfo} /> //keyを指定
      })}
    </CustomPaper>
  )
}
