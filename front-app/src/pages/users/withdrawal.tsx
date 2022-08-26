// import { NextPage } from 'next'
// import Router from 'next/router'
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputAdornment,
  InputLabel,
  IconButton,
  OutlinedInput,
  Hidden,
} from '@mui/material'
import React, { useState } from 'react'
import Comment from 'components/elements/comment'
import CustomPaper from 'components/layouts/customPaper'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

export default function withdrawal() {
  return (
    <>
      <CustomPaper elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            // onClick={() => handleLink('./search/searchResult')}
          >
            マイページ
          </Button>
        </Grid>
      </CustomPaper>

      <CustomPaper sx={{ mt: 1 }}>
        <Typography variant="h5" gutterBottom color="primary">
          退会
        </Typography>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
            退会しますか？
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            退会後も投稿した口コミは削除されません。<br></br>
            本当に退会しますか？
          </Typography>

          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              // onClick={() => handleLink('./search/searchResult')}
            >
              退会しない
            </Button>
            <Button
            //   variant="contained"
            // onClick={() => handleLink('./search/searchResult')}
            >
              退会する
            </Button>
          </Grid>
        </Paper>
      </CustomPaper>
    </>
  )
}
