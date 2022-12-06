import { NextPage } from 'next'
import Router from 'next/router'
import {
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import theme from '../styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import CustomButton from '@/components/elements/CustomButton'
import { LoginInfo } from '@/features/login/types'
import { path, strage } from '@/const/Consts'
import * as Dialog from '@/context/MessageDialog'
import { useHaveToken } from '@/hooks/useHaveToken'

function Home() {
  const router = useRouter()
  const { haveToken, isAuthChecking } = useHaveToken()

  if (isAuthChecking) {
    // return <div>ログイン情報を確認中…</div>
    return (
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
      >
        <Grid item xs={12}>
          <Typography variant="body1">読み込み中...</Typography>
        </Grid>
      </Grid>
    )
  }

  if (haveToken) {
    router.push(path.cafesList)
  } else {
    router.push(path.login)
  }

  return <></>
}

export default Home
