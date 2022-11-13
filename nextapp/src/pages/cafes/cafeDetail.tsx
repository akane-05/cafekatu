// import { NextPage } from 'next'
// import Router from 'next/router'
import { Button, Paper } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CafeInfo from '@/components/elements/CafeInfo'
import Comment from '@/components/elements/Comment'
import CommentPost from '@/components/elements/CommentPost'
import CustomPaper from '@/components/layouts/CustomPaper'
import { useCafes } from '@/features/cafes/api/getCafes'
import { useRouter } from 'next/router'

type State = {
  isCommentPost: boolean
}

export default function CafeDetail() {
  //   const [cafeInfo, setCafeInfo] = useState()
  const router = useRouter()
  const id = router.query.id === undefined ? '' : router.query.id[0]
  // console.log('CafeDetail' + id)
  const cafeQuery = useCafe(id)

  // console.log('CafeDetail' + cafeQuery.data)

  const [values, setValues] = React.useState<State>({
    isCommentPost: false,
  })

  const handleCommentPost = () => {
    setValues({
      ...values,
      isCommentPost: !values.isCommentPost,
    })
  }

  if (cafeQuery.isLoading) {
    return <span>Loading...</span>
  }

  return (
    <>
      <CustomPaper>
        <Button variant="contained" onClick={() => router.back()}>
          店舗一覧に戻る
        </Button>
        <CafeInfo cafeInfo={cafeQuery.data}></CafeInfo>
      </CustomPaper>

      <CustomPaper sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleCommentPost}>
          口コミを投稿する
        </Button>

        {values.isCommentPost ? <CommentPost num={1}></CommentPost> : <></>}
        <Comment mypage={true}></Comment>
      </CustomPaper>
    </>
  )
}
