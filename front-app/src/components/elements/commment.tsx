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

export default function Comment() {
  // const handleLink = (path: string) => {
  //   Router.push(path)
  // }
  return (
    <>
      <Card sx={{ display: 'flex' }}>
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          image="public/favicon.ico"
          alt="写真の説明"
        />

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5">
              名前
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
            <Box sx={{ display: 'flex', mr: 3 }}>
              <Typography variant="subtitle1" color="text.secondary">
                ☆☆☆
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                3.0
              </Typography>
            </Box>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="primary">
              ボタン
            </Button>
          </CardActions>
        </Box>
      </Card>
    </>
  )
}
