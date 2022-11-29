// import { NextPage } from 'next'
// import Router from 'next/router'
import { Paper, Grid, Button, Typography } from '@mui/material'
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
import { path, strage } from '@/const/Consts'
import PageButton from '@/components/elements/PageButton'
import { Pagination } from '@mui/material'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import { haveTokenState } from '@/globalStates/haveToken'

export default function CafesList() {
  const router = useRouter()
  const [page, setPage] = React.useState(1)
  const setHaveToken = useSetRecoilState(haveTokenState)
  const [parPage, setparPage] = React.useState(10)
  const { response, isLoading, isError } = useCafes(
    page,
    parPage,
    router.query.searchWord,
  )

  const handleLink = (path: string) => {
    router.push(path)
  }

  if (isLoading) {
    return (
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item xs={12}>
          <Typography variant="body1">読み込み中...</Typography>
        </Grid>
      </Grid>
    )
  }

  if (isError && isError?.response?.status == 401) {
    setHaveToken(false)

    return (
      <>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item xs={12} p={2}>
            <Typography variant="body1">
              ログイン情報を取得できませんでした。再度ログインしてください。
            </Typography>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLink(path.top)}
          >
            Top画面に戻る
          </Button>
        </Grid>
      </>
    )
  }

  if (isError) {
    return (
      <>
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item xs={12} p={2}>
            <Typography variant="body1">エラーが発生しました</Typography>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLink(path.top)}
          >
            Top画面に戻る
          </Button>
        </Grid>
      </>
    )
  }

  return (
    <CustomPaper>
      {response.data?.cafes_total != 0 ? (
        <>
          <Typography style={{ color: '#515151' }}>
            {parPage * (page - 1) + 1}～
            {parPage * (page - 1) + response.data?.cafes.length} 件を表示 ／ 全
            {response.data?.cafes_total} 件
          </Typography>
          {response.data?.cafes.map((cafeInfo: CafeInfo) => {
            return <CafeCard key={cafeInfo.id} cafeInfo={cafeInfo} /> //keyを指定
          })}
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            direction="column"
          >
            <Grid item xs={12}>
              <Pagination
                count={response.data?.pages_total}
                hideNextButton={
                  page == response.data?.pages_total ? true : false
                }
                hidePrevButton={page == 1 ? true : false}
                defaultPage={1}
                siblingCount={3}
                color="primary" //ページネーションの色
                onChange={(e, page) => setPage(page)} //変更されたときに走る関数。第2引数にページ番号が入る
                page={page} //現在のページ番号
              />
            </Grid>
          </Grid>
        </>
      ) : (
        <Grid
          container
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item xs={12}>
            <Typography variant="body1">
              条件に該当するお店は見つかりませんでした。
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ color: '#515151' }} variant="body2">
              検索条件を変更してください。
            </Typography>
          </Grid>
        </Grid>
      )}
    </CustomPaper>
  )
}
