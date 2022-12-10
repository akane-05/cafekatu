import { Box, Grid, Typography, Button } from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import { pagePath } from '@/const/Consts'

export default function Custom500() {
  const router = useRouter()
  const handleLink = (path: string) => {
    router.push(path)
  }

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
          <Typography variant="h5">500</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">サーバーでエラーが発生しました</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 2 }}></Box>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLink(pagePath('top'))}
          >
            Top画面に戻る
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}
