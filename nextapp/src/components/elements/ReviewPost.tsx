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
} from '@mui/material'
import React, { useRef } from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

type Props = {
  //num: number
}

type State = {
  rating: number
  comment: string
}

type Error = {
  rating: boolean
  comment: boolean
}

export default function ReviewPost(props: Props) {
  const [values, setValues] = React.useState<State>({
    rating: 0,
    comment: '',
  })

  const [errors, setErrors] = React.useState<Error>({
    rating: false,
    comment: false,
  })

  // const handleLink = (path: string) => {
  //   Router.push(path)
  // }

  const commentVaildPattern = '^.{1,250}$'
  const commentRef = useRef<HTMLInputElement>(null)

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let ref = null
      switch (prop) {
        case 'comment':
          ref = commentRef.current
          break
      }
      setErrors({ ...errors, [prop]: !ref?.validity.valid })

      setValues({ ...values, [prop]: event.target.value })
    }

  return (
    <Card sx={{ mt: 1, mb: 1 }}>
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
      <CardContent sx={{ alignSelf: 'stretch' }}>
        <Typography component="div" variant="h5">
          {/* {props.num} */}
          ユーザー名
        </Typography>

        <Grid container>
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mr: 3 }}
            >
              ☆☆☆
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mr: 3 }}
            >
              3.0
            </Typography>
          </Grid>
        </Grid>

        <TextField
          id="comment"
          label="口コミ"
          multiline
          fullWidth
          rows={4}
          defaultValue="コメント"
          sx={{ mb: 1 }}
          onChange={handleChange('comment')}
          required={true}
          error={errors.comment}
          inputProps={{
            required: true,
            pattern: commentVaildPattern,
          }}
          inputRef={commentRef}
          helperText={
            errors.comment && '必須項目です。250字以内で入力してください。'
          }
        />

        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="flex-end"
        >
          <Button variant="contained" color="primary">
            投稿
          </Button>
        </Grid>
      </CardContent>
      {/* </Grid>
      </Grid> */}
    </Card>
  )
}
