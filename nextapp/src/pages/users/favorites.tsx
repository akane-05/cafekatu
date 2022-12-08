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
import * as Dialog from '@/context/MessageDialog'
import { path, strage } from '@/const/Consts'
import { Pagination } from '@mui/material'
import { useUserFavorites } from '@/features/users/api/useUserFavorites'
import Error from '@/pages/_error'

export default function UserFavorites() {
  const router = useRouter()
  const [page, setPage] = React.useState(1)
  const [parPage, setparPage] = React.useState(10)
  const { response, isLoading, isError } = useUserFavorites(page, parPage)

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
        <Link
          onClick={() => handleLink(path.cafesList)}
          component="button"
          variant="body1"
        >
          店舗一覧に戻る
        </Link>
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
                お気に入りに登録した店舗はありません。
              </Typography>
            </Grid>
          </Grid>
        )}
      </CustomPaper>
    </>
  )
}
