// import { NextPage } from 'next'
// import Router from 'next/router'
import { Paper, Grid, Button, Typography, Link } from '@mui/material'
import React from 'react'
import CafeCard from '@/components/elements/CafeCard'
import CustomPaper, { LinkPaper } from '@/components/elements/CustomPaper'
import Router from 'next/router'
import { CafeInfo } from '@/features/cafes/types'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
//import { getCafes } from '@/features/cafes/api/getCafes'
import { useCafes } from '@/features/cafes/api/useCafes'
import * as Dialog from '@/context/MessageDialog'
import { pagePath } from '@/const/Consts'
import { Pagination } from '@mui/material'
import Error from '@/pages/_error'

export default function CafesList() {
  const router = useRouter()
  const [page, setPage] = React.useState(1)
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

  if (isError) {
    return (
      <Error
        statusCode={isError.response ? isError.response.status : 500}
      ></Error>
    )
  }

  return (
    <>
      <LinkPaper elevation={0}>
        <Grid
          container
          alignItems="center"
          justifyContent="flex-end"
          direction="row"
        >
          <Link
            onClick={() => handleLink(pagePath('cafeRegister'))}
            component="button"
            variant="body1"
          >
            店舗登録
          </Link>
        </Grid>
      </LinkPaper>
      <CustomPaper>
        {response.data?.cafes_total != 0 ? (
          <>
            <Typography color="text.secondary">
              {parPage * (page - 1) + 1}～
              {parPage * (page - 1) + response.data?.cafes.length} 件を表示 ／
              全{response.data?.cafes_total} 件
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
              <Typography color="text.secondary" variant="body2">
                検索条件を変更してください。
              </Typography>
            </Grid>
          </Grid>
        )}
      </CustomPaper>
    </>
  )
}
