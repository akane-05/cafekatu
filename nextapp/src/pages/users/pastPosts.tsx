// import { NextPage } from 'next'
// import Router from 'next/router'
import { Paper, Grid, Button, Typography, Link, Box } from '@mui/material'
import React from 'react'
import CafeCard from '@/components/elements/CafeCard'
import CustomPaper, { LinkPaper } from '@/components/elements/CustomPaper'
import Router from 'next/router'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
//import { getCafes } from '@/features/cafes/api/getCafes'
import { usePastPosts } from '@/features/users/api/usePastPosts'
import * as Dialog from '@/context/MessageDialog'
import { path, strage } from '@/const/Consts'
import PageButton from '@/components/elements/PageButton'
import { Pagination } from '@mui/material'
//import { CafeInfo } from '@/features/cafes/types'
import ReviewCard from '@/components/elements/ReviewCard'
import { Review } from '@/features/reviews/types'
import Error from '@/pages/_error'
import { CafeInfo } from '@/features/cafes/types'

export type PastPost = {
  cafeInfo: CafeInfo
  reviews: Review[]
}

export default function pastPosts() {
  const router = useRouter()
  const [page, setPage] = React.useState(1)
  const [parPage, setparPage] = React.useState(10)
  const { response, isLoading, isError, mutate } = usePastPosts(page, parPage)

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
          justifyContent="space-between"
          direction="row"
        >
          <Link
            onClick={() => handleLink(path.cafesList)}
            component="button"
            variant="body1"
          >
            店舗一覧に戻る
          </Link>
          {response.data?.cafes_total != 0 ? (
            <Typography color="text.secondary">
              {parPage * (page - 1) + 1}～
              {parPage * (page - 1) + response.data?.pastPosts.length} 件を表示
              ／ 全{response.data?.cafes_total} 件
            </Typography>
          ) : (
            <></>
          )}
        </Grid>
      </LinkPaper>
      {response.data?.cafes_total != 0 ? (
        <>
          {response.data?.pastPosts.map((pastPost: PastPost, index: number) => {
            return (
              <Box key={index}>
                <CustomPaper>
                  <CafeCard cafeInfo={pastPost.cafeInfo}></CafeCard>
                  {pastPost.reviews.map((review: Review) => {
                    return (
                      <ReviewCard
                        key={review.id}
                        review={review}
                        pastPost={true}
                        mutate={mutate}
                      />
                    ) //keyを指定
                  })}
                </CustomPaper>
                <Box sx={{ mb: 2 }}></Box>
              </Box>
            )
          })}

          <LinkPaper elevation={0}>
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
          </LinkPaper>
        </>
      ) : (
        <CustomPaper>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            direction="column"
          >
            <Grid item xs={12}>
              <Typography variant="body1">
                過去に投稿したレビューはありません。
              </Typography>
            </Grid>
          </Grid>
        </CustomPaper>
      )}
    </>
  )
}
