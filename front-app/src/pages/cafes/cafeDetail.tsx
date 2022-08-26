// import { NextPage } from 'next'
// import Router from 'next/router'
import { Button, Paper } from '@mui/material'
import React, { useState } from 'react'
import CafeInfo from 'components/elements/cafeInfo'
import Comment from 'components/elements/comment'
import CommentPost from 'components/elements/commentPost'
import CustomPaper from 'components/layouts/customPaper'

interface Props {
  num: number
}

interface State {
  isCommentPost: boolean
}

export default function CafeDetail(props: Props) {
  const [values, setValues] = React.useState<State>({
    isCommentPost: false,
  })

  const handleCommentPost = () => {
    setValues({
      ...values,
      isCommentPost: !values.isCommentPost,
    })
  }

  return (
    <>
      <CustomPaper>
        <Button
          variant="contained"
          // onClick={() => handleLink('./search/searchResult')}
        >
          店舗一覧に戻る
        </Button>
        <CafeInfo num={1}></CafeInfo>
      </CustomPaper>

      <CustomPaper sx={{ mt: 2 }}>
        <Button variant="contained" onClick={handleCommentPost}>
          口コミを投稿する
        </Button>

        {values.isCommentPost ? <CommentPost num={1}></CommentPost> : <></>}
        <Comment></Comment>
      </CustomPaper>
    </>
  )
}
