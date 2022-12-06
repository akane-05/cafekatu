// import { NextPage } from 'next'
// import Router from 'next/router'
import {
  Grid,
  TextField,
  Button,
  Paper,
  Card,
  CardMedia,
  CardContent,
  Box,
  Typography,
  CardActions,
  Hidden,
  Link,
  Rating,
} from '@mui/material'
import React from 'react'
import { ReviewInfo } from '@/features/reviews/types/index'
import * as Dialog from '@/context/MessageDialog'
import { deleteReview } from '@/features/reviews/api/deleteReview'

type Props = {
  review: ReviewInfo
  pastPost?: boolean
  mutate?: any
}

export default function ReviewCard(props: Props) {
  const dialog = Dialog.useDialogContext()
  const review = props.review
  const pastPost = props.pastPost

  const handleDialog = async (id: number) => {
    await dialog
      .confirm(Dialog.confirmDialog('選択した投稿を削除しますか？'))
      .then(() => {
        handleDeleteReview(id)
        props.mutate()
      })
  }

  const handleDeleteReview = async (id: number) => {
    const response = await deleteReview(id)
    if (response.status == 200) {
      dialog.confirm(Dialog.apiOKDialog(response.message))
      console.log(props.mutate)
      props.mutate()
    } else {
      dialog.confirm(Dialog.apiErrorDialog(response.status, response.error))
    }
  }

  return (
    <Card sx={{ mt: 1, mb: 1 }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        {/* <Grid item xs={12} sm={3}>
          <CardMedia
            component="img"
            // sx={{ width: 151 }}
            image="/cake.jpg"
            alt="写真の説明"
            sx={{ width: '100%', height: '100%' }}
          />
        </Grid> */}

        <Grid item xs={12} sm={12}>
          <CardContent sx={{ alignSelf: 'stretch' }}>
            {pastPost ? (
              <></>
            ) : (
              <Typography component="div" variant="h6" sx={{ mb: 1 }}>
                {review.nickname}
              </Typography>
            )}

            <Grid container>
              <Grid item xs={6} sm={3}>
                <Rating
                  name="star-rating"
                  readOnly
                  value={review.rating}
                  precision={0.1}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mr: 3 }}
                >
                  {review.rating}
                </Typography>
              </Grid>
              <Grid item xs={0} sm={6}>
                <Hidden></Hidden>
              </Grid>

              <Grid item xs={12}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  component="div"
                  sx={{ mb: 1 }}
                >
                  {review.comment}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                {pastPost ? (
                  <>
                    <Grid
                      container
                      direction="row"
                      justifyContent="flex-end"
                      alignItems="center"
                    >
                      <Link
                        component="button"
                        variant="body1"
                        onClick={() => handleDialog(review.id ? review.id : 0)}
                      >
                        削除
                      </Link>
                    </Grid>
                  </>
                ) : (
                  <></>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}
