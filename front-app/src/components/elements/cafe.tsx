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

interface Props {
  num: number
}

export default function Cafe(props: Props) {
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
              {props.num}
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              ○○○
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              component="div"
            >
              ○○○
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
          </CardContent>

          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button variant="contained" color="primary" sx={{ mb: 2, mr: 2 }}>
              ボタン
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  )
}
