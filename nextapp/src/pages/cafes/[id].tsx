// import { NextPage } from 'next'
// import Router from 'next/router'
import { Button, Grid, Typography, Link } from '@mui/material'
import React, { useState, useEffect } from 'react'
import CafeCard from '@/components/elements/CafeCard'
import ReviewCard from '@/components/elements/ReviewCard'
import CustomPaper, { LinkPaper } from '@/components/elements/CustomPaper'
import { useCafe } from '@/features/cafes/api/useCafe'
import { useRouter } from 'next/router'
import { path, strage, requests } from '@/const/Consts'
import ReviewsList from '@/components/elements/ReviewsList'
import Error from '@/pages/_error'

export default function CafeDetail() {
  const router = useRouter()

  const { response, isLoading, isError, mutate } = useCafe(router.query.id)

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
          onClick={() => handleLink(path.cafes)}
          component="button"
          variant="body1"
        >
          店舗一覧に戻る
        </Link>
      </LinkPaper>

      <CustomPaper>
        <CafeCard cafeInfo={response.data.cafe} detail={true}></CafeCard>
      </CustomPaper>

      <ReviewsList
        id={router.query.id ? router.query.id : null}
        parentMutate={mutate}
      />
    </>
  )
}
