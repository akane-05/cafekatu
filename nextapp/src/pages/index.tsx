import { NextPage } from 'next'
import Router from 'next/router'
import { Typography, Grid } from '@mui/material'
import theme from '../styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import React, { useState, useRef } from 'react'
import CustomButton from '@/components/elements/CustomButton'

function Home() {
  const handleLink = (path: string) => {
    Router.push(path)
  }

  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        rowSpacing={1}
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item xs={12}>
          <Typography variant="h2" color="primary">
            Cafe活
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <CustomButton
            variant="contained"
            onClick={() => handleLink('./users/loginForm')}
          >
            ログイン
          </CustomButton>
        </Grid>

        <Grid item xs={12}>
          <CustomButton
            variant="contained"
            onClick={() => handleLink('./users/registerForm')}
          >
            新規会員登録
          </CustomButton>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default Home
