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
} from '@mui/material'
import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

interface Props {
  num: number
  mypage: boolean | null
}

export default function Comment(props: Props) {
  // const handleLink = (path: string) => {
  //   Router.push(path)
  // }
  const mypage = props.mypage ? true : false

  return (
    <Card sx={{ mt: 1, mb: 1 }}>
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item xs={12} sm={3}>
          <CardMedia
            component="img"
            // sx={{ width: 151 }}
            image="/cake.jpg"
            alt="写真の説明"
            sx={{ width: '100%', height: '100%' }}
          />
        </Grid>

        <Grid item xs={12} sm={9}>
          <CardContent sx={{ alignSelf: 'stretch' }}>
            <Typography component="div" variant="h5" sx={{ mb: 1 }}>
              {/* {props.num} */}
              ユーザー名
            </Typography>

            <Grid container>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mr: 3 }}
                >
                  ☆☆☆
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mr: 3 }}
                >
                  3.0
                </Typography>
              </Grid>
              <Grid item xs={0} sm={6}>
                <Hidden></Hidden>
              </Grid>
            </Grid>

            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
              sx={{ mb: 1 }}
            >
              コメント
            </Typography>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              {props.mypage ? <Button variant="contained">削除</Button> : <></>}
            </Grid>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}
