import React from 'react'
import { NextPage, NextPageContext } from 'next'
import { Box, Grid, Typography, Button } from '@mui/material'
import { useRouter } from 'next/router'
import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import { pagePath } from '@/const/Consts'

interface Props {
  statusCode: number
}
const Error: NextPage<Props> = ({ statusCode }) => {
  const router = useRouter()
  const handleLink = (path: string) => {
    router.push(pagePath(path))
  }

  let errMessage = 'エラーが発生しました'
  if (statusCode == 401) {
    errMessage =
      'ログイン情報を取得できませんでした。再度ログインしてください。'
  } else if (statusCode == 400) {
    errMessage = 'パラメータに不正な値が含まれています。'
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
          <Typography variant="h5">{statusCode}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{errMessage}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 2 }}></Box>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLink('top')}
          >
            Top画面に戻る
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

Error.getInitialProps = async ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode ?? 500 : 404
  return { statusCode }
}

export default Error
