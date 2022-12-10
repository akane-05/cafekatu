// import { NextPage } from 'next'
// import Router from 'next/router'
import {
  Paper,
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  Select,
  TextField,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  Rating,
} from '@mui/material'
import React, { useRef } from 'react'
import CustomPaper from '@/components/elements/CustomPaper'
import Router from 'next/router'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
//import { getCafes } from '@/features/cafes/api/getCafes'
import { useReviews } from '@/features/reviews/api/useReviews'
import * as Dialog from '@/context/MessageDialog'
import { pagePath, ratingList, errStatus } from '@/const/Consts'
import { Pagination } from '@mui/material'
import { ReviewInfo } from '@/features/reviews/types/index'
import ReviewCard from '@/components/elements/ReviewCard'
// import ReviewPost from '@/components/elements/ReviewPost'
import { useUserInfo } from '@/hooks/useUserInfo'
import { postReview } from '@/features/reviews/api/postReview'
import useSWR, { useSWRConfig, KeyedMutator } from 'swr'
import * as yup from 'yup'
import { validate } from '@/lib/validate'
import { makeStyles } from '@mui/styles'

type Props = {
  id: any
  parentMutate?: any
}

const useStyles = makeStyles((theme) => ({
  menuPaper: {
    mixHeight: 100,
    maxHeight: 200,
  },
}))

export default function ReviewsList(props: Props) {
  const router = useRouter()
  const [page, setPage] = React.useState(1)
  const [perPage, setperPage] = React.useState(10)
  const { response, isLoading, isError, mutate } = useReviews(
    page,
    perPage,
    props.id,
  )
  const dialog = Dialog.useDialogContext()
  const [isCommentPost, setIsCommentPost] = React.useState<boolean>(false)

  const classes = useStyles()

  const { userInfo } = useUserInfo()

  const defaultReview: ReviewInfo = {
    cafe_id: 0,
    rating: 0,
    comment: '',
  }

  const [values, setValues] = React.useState<ReviewInfo>(defaultReview)

  const [errors, setErrors] = useState<any>({})

  // バリデーションルール
  const scheme = yup.object({
    rating: yup.string().required('必須項目です'),
    comment: yup
      .string()
      .required('必須項目です')
      .matches(/^.{1,250}$/, '必須項目です。250字以内で入力してください。'),
  })

  const handleCommentPost = async () => {
    if (isCommentPost) {
      await dialog
        .confirm(Dialog.confirmDialog('編集内容を破棄します、よろしいですか？'))
        .then(() => {
          setValues(defaultReview)
          setIsCommentPost(!isCommentPost)
        })
    } else {
      setIsCommentPost(!isCommentPost)
    }
  }

  const handleChange =
    (prop: keyof ReviewInfo) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const handleSelect = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number

    setValues({ ...values, ['rating']: value })
  }

  const handlePostReview = async () => {
    const errors = validate({ ...values }, scheme)
    setErrors(errors)
    let error = false
    for (const key of Object.keys(errors)) {
      if (errors[key]) {
        error = true
      }
    }

    if (!error) {
      const response = await postReview(values, props.id)

      if (response.status == 200) {
        setValues(defaultReview)
        dialog.confirm(Dialog.apiOKDialog(response.message))
        mutate()
        if (props.parentMutate) {
          props.parentMutate()
        }
        setIsCommentPost(!isCommentPost)
      } else {
        if (errStatus.includes(response.status)) {
          router.push({
            pathname: pagePath('error'),
            query: { status: response.status, error: response.error },
          })
        } else {
          dialog.confirm(Dialog.apiErrorDialog(response.status, response.error))
        }
      }
    }
  }

  if (isLoading) {
    return <span>読み込み中...</span>
  }
  if (isError) {
    return (
      <>
        <CustomPaper sx={{ mt: 2 }}>
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
          {/* <ReviewPost id={props.id}></ReviewPost> */}
          <Card sx={{ mt: 1, mb: 1 }}>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              {/* <Grid container>
        <Grid xs={12} sm={3}>
          <CardMedia
            component="img"
            // sx={{ width: 151 }}
            image="/cake.jpg"
            alt="写真の説明"
          />
        </Grid>

        <Grid xs={12} sm={9}> */}
              <Grid item xs={12} sm={12}>
                <CardContent sx={{ alignSelf: 'stretch' }}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography
                        component="div"
                        variant="h6"
                        sx={{ mb: 1, pl: 1 }}
                      >
                        {userInfo?.nickname}
                      </Typography>
                    </Grid>

                    <Grid item xs={6} pt={2} pl={1}>
                      <Rating
                        name="star-rating"
                        value={values.rating}
                        precision={0.1}
                        onChange={(event, newValue) => {
                          setValues({
                            ...values,
                            ['rating']: newValue ? newValue : 0,
                          })
                        }}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl sx={{ m: 1, minWidth: 100 }} size="small">
                        <InputLabel>評価</InputLabel>
                        <Select
                          labelId="rating"
                          id="rating"
                          label="評価"
                          value={values.rating}
                          required={true}
                          onChange={handleSelect}
                          inputProps={{
                            required: true,
                          }}
                          MenuProps={{ classes: { paper: classes.menuPaper } }}
                        >
                          {ratingList
                            .sort((a, b) => (a > b ? -1 : 1))
                            .map((rate: number, index: number) => (
                              <MenuItem key={index} value={rate}>
                                {rate}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} p={1}>
                      <TextField
                        required
                        label="コメント"
                        variant="outlined"
                        id="comment"
                        multiline
                        fullWidth
                        rows={4}
                        //defaultValue="コメント"
                        sx={{ mb: 1 }}
                        onChange={handleChange('comment')}
                        // required={true}
                        error={!!errors.comment}
                        helperText={errors.comment?.message}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                  >
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handlePostReview}
                    >
                      投稿
                    </Button>
                  </Grid>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
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

      {response.data?.reviews_total != 0 ? (
        <>
          {response.data.reviews?.map((review: ReviewInfo) => {
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
        <></>
      )}
    </CustomPaper>
  )
}
