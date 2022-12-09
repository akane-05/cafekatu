// import { NextPage } from 'next'
// import Router from 'next/router'
import { Box, Grid, Typography, Button } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import { path } from '@/const/Consts'

export default function Error() {
  const router = useRouter()

  const handleLink = (path: string) => {
    router.push(path)
  }
  const status = router.query.status
  const message = router.query.error

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item xs={12}>
          <Box sx={{ p: 2 }}></Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5">{status}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{message}</Typography>{' '}
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 2 }}></Box>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLink(path.top)}
          >
            Top画面に戻る
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}
