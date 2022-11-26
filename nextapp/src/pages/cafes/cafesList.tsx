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
//import { getCafes } from '@/features/cafes/api/getCafes'
import { useCafes } from '@/features/cafes/api/useCafes'
import * as Dialog from '@/context/MessageDialog'
import { path } from '@/const/Consts'
import { ContactMailOutlined } from '@mui/icons-material'
import PageButton from '@/components/elements/PageButton'
import { useHaveToken } from '@/hooks/useHaveToken'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import { haveTokenState } from '@/globalStates/haveToken'

// import { info } from 'console'

export default function CafesList() {
  const router = useRouter()
  const [page, setPage] = React.useState(1)
  const [parPage, setparPage] = React.useState(10)
  const setHaveToken = useSetRecoilState(haveTokenState)

  const { response, isLoading, isError } = useCafes(
    page,
    parPage,
    router.query.searchWord,
  )

  const handleLink = (path: string) => {
    router.push(path)
  }

  if (isLoading) {
    return <span>読み込み中...</span>
  }

  if (isError && isError.response.status == 401) {
    console.log(isError)
    console.log(isError.message)
    console.log(isError.response)
    console.log(isError.response.status)
    setHaveToken(false)

    return (
      <>
        <span>
          ログイン情報を取得できませんでした。再度ログインしてください。
        </span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleLink(path.top)}
        >
          Top画面に戻る
        </Button>
      </>
    )
  }

  if (isError) {
    console.log(isError)
    console.log(isError.response.stasus)
    return (
      <>
        <span>エラーが発生しました</span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleLink(path.top)}
        >
          Top画面に戻る
        </Button>
      </>
    )
  }

  return (
    <CustomPaper>
      {response.data?.map((cafeInfo: CafeInfo) => {
        return <CafeCard key={cafeInfo.id} cafeInfo={cafeInfo} /> //keyを指定
      })}

      <PageButton variant="outlined" onClick={() => setPage(page - 1)}>
        ＜
      </PageButton>
      <PageButton variant="outlined" onClick={() => setPage(page + 1)}>
        ＞
      </PageButton>
    </CustomPaper>
  )
}
