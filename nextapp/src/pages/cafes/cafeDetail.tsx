// import { NextPage } from 'next'
// import Router from 'next/router'
import { Button, Paper } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CafeInfo from '@/components/elements/CafeInfo'
import ReviewCard from '@/components/elements/Review'
import ReviewPost from '@/components/elements/ReviewPost'
import CustomPaper from '@/components/layouts/CustomPaper'
import { useCafe } from '@/features/cafes/api/useCafe'
import { useRouter } from 'next/router'
import { path } from '@/const/Consts'
import { Review } from '@/features/cafes/types/index'
import PageButton from '@/components/elements/PageButton'

type State = {
  isCommentPost: boolean
}

export default function CafeDetail() {
  //   const [cafeInfo, setCafeInfo] = useState()
  const router = useRouter()
  //const id = router.query.id === undefined ? '' : router.query.id[0]
  //const cafeQuery = useCafe(router.query.id)
  const { response, isLoading, isError } = useCafe(1, 10, router.query.id)

  // const [values, setValues] = React.useState<State>({
  //   isCommentPost: false,
  // })

  const [isCommentPost, setIsCommentPost] = React.useState<boolean>(false)

  const [page, setPage] = React.useState(1)

  const handleCommentPost = () => {
    setIsCommentPost(!isCommentPost)
  }

  const handleLink = (path: string) => {
    router.push(path)
  }

  if (isLoading) {
    return <span>読み込み中...</span>
  }

  if (isError) {
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
    <>
      <CustomPaper>
        <Button variant="contained" onClick={() => handleLink(path.cafesList)}>
          店舗一覧に戻る
        </Button>
        <CafeInfo cafeInfo={response.data.cafe}></CafeInfo>
      </CustomPaper>

      <CustomPaper sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleCommentPost}>
          口コミを投稿する
        </Button>

        {isCommentPost ? <ReviewPost num={1}></ReviewPost> : <></>}

        {response.data.reviews?.map((review: Review) => {
          return <ReviewCard key={review.id} review={review} /> //keyを指定
        })}
        <PageButton variant="outlined" onClick={() => setPage(page - 1)}>
          ＜
        </PageButton>
        <PageButton variant="outlined" onClick={() => setPage(page + 1)}>
          ＞
        </PageButton>
      </CustomPaper>
    </>
  )
}
