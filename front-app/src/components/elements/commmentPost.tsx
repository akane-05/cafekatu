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
import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface Props {
  num: number
}

export default function Comment(props: Props) {
  // const handleLink = (path: string) => {
  //   Router.push(path)
  // }



  return (
    <Card sx={{ mt: 1, mb: 1 }}>
      <Grid container>
        <Grid xs={12} sm={3}>
          <CardMedia
            component="img"
            // sx={{ width: 151 }}
            image="/cake.jpg"
            alt="写真の説明"
          />
        </Grid>

        <Grid xs={12} sm={9}>
          <CardContent sx={{ alignSelf: 'stretch' }}>
          
            <Typography component="div" variant="h5">
              {/* {props.num} */}
              ユーザー名
            </Typography>

            <Grid container>
              <Grid xs={6}>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{ mr: 3 }}
                >
                  ☆☆☆
                </Typography>
              </Grid>
              <Grid xs={6}>
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
          label="comment"
          multiline
          rows={4}
          defaultValue="コメント"
        />

            <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button variant="contained" color="primary" sx={{ mb: 2, mr: 2 }}>
              投稿
            </Button>
          </Grid>

          </CardContent>
        </Grid>
      </Grid>
    </Card>
  )
}
