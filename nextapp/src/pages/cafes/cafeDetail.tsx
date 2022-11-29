// import { NextPage } from 'next'
// import Router from 'next/router'
import { Button, Grid, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CafeInfo from '@/components/elements/CafeInfo'
import ReviewCard from '@/components/elements/Review'
import ReviewPost from '@/components/elements/ReviewPost'
import CustomPaper from '@/components/layouts/CustomPaper'
import { useCafe } from '@/features/cafes/api/useCafe'
import { useRouter } from 'next/router'
import { path, strage } from '@/const/Consts'
import { Review } from '@/features/cafes/types/index'
import PageButton from '@/components/elements/PageButton'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import { haveTokenState } from '@/globalStates/haveToken'
import ReviewsList from '@/components/elements/ReviewsList'

type State = {
  isCommentPost: boolean
}

export default function CafeDetail() {
  const router = useRouter()
  const { response, isLoading, isError } = useCafe(1, 10, router.query.id)

  // const [values, setValues] = React.useState<State>({
  //   isCommentPost: false,
  // })

  const [isCommentPost, setIsCommentPost] = React.useState<boolean>(false)

  const [page, setPage] = React.useState(1)

  const setHaveToken = useSetRecoilState(haveTokenState)

  const handleCommentPost = () => {
    setIsCommentPost(!isCommentPost)
  }

  const handleLink = (path: string) => {
    router.push(path)
  }

  if (isLoading) {
    // return <span>読み込み中...</span>
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
        {/* <span>
          ログイン情報を取得できませんでした。再度ログインしてください。
        </span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleLink(path.top)}
        >
          Top画面に戻る
        </Button> */}
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
        {/* <span>エラーが発生しました</span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleLink(path.top)}
        >
          Top画面に戻る
        </Button> */}

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
    <>
      <CustomPaper>
        <Button variant="contained" onClick={() => handleLink(path.cafesList)}>
          店舗一覧に戻る
        </Button>
        <CafeInfo cafeInfo={response.data.cafe}></CafeInfo>
      </CustomPaper>

      <ReviewsList id={router.query.id}></ReviewsList>
    </>
  )
}
