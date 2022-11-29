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
import { useReviews } from '@/features/reviews/api/useReviews'
import * as Dialog from '@/context/MessageDialog'
import { path, strage } from '@/const/Consts'
import PageButton from '@/components/elements/PageButton'
import { Pagination } from '@mui/material'
import { Review } from '@/features/cafes/types/index'
import ReviewCard from '@/components/elements/Review'
import ReviewPost from '@/components/elements/ReviewPost'

type Props = {
  id: undefined | string | string[]
}

export default function ReviewsList(props: Props) {
  const router = useRouter()
  const [page, setPage] = React.useState(1)
  const [parPage, setparPage] = React.useState(10)
  const { response, isLoading, isError } = useReviews(page, parPage, props.id)
  const dialog = Dialog.useDialogContext()

  const [isCommentPost, setIsCommentPost] = React.useState<boolean>(false)

  //   const handleLink = (path: string) => {
  //     router.push(path)
  //   }

  const handleCommentPost = async () => {
    if (isCommentPost) {
      await dialog
        .confirm(Dialog.confirmDialog('編集内容を破棄します、よろしいですか？'))
        .then(() => {
          setIsCommentPost(!isCommentPost)
        })
    } else {
      setIsCommentPost(!isCommentPost)
    }
  }

  if (isLoading) {
    return <span>読み込み中...</span>
  }
  if (isError) {
    return (
      <>
        <CustomPaper sx={{ mt: 2 }}>
          {/* <span>口コミを取得できませんでした。</span> */}

          <Grid
            container
            alignItems="center"
            justifyContent="center"
            direction="column"
          >
            <Grid item xs={12} p={2}>
              <Typography variant="body1">
                口コミを取得できませんでした。
              </Typography>
            </Grid>
          </Grid>
        </CustomPaper>

        {/* <span>エラーが発生しました</span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleLink(path.top)}
        >
          Top画面に戻る
        </Button> */}
      </>
    )
  }

  return (
    <CustomPaper sx={{ mt: 2 }}>
      {isCommentPost ? (
        <>
          <Grid
            container
            alignItems="flex-end"
            justifyContent="flex-end"
            direction="column"
          >
            <Grid item xs={12}>
              <Button variant="contained" onClick={handleCommentPost}>
                キャンセル
              </Button>
            </Grid>
          </Grid>
          <ReviewPost></ReviewPost>
        </>
      ) : (
        <Grid
          container
          alignItems="flex-end"
          justifyContent="flex-end"
          direction="column"
        >
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleCommentPost}>
              口コミを投稿する
            </Button>
          </Grid>
        </Grid>
      )}

      {response.data.reviews?.map((review: Review) => {
        return <ReviewCard key={review.id} review={review} /> //keyを指定
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
            hideNextButton={page == response.data?.pages_total ? true : false}
            hidePrevButton={page == 1 ? true : false}
            defaultPage={1}
            siblingCount={3}
            color="primary" //ページネーションの色
            onChange={(e, page) => setPage(page)} //変更されたときに走る関数。第2引数にページ番号が入る
            page={page} //現在のページ番号
          />
        </Grid>
      </Grid>
    </CustomPaper>
  )
}
