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
  Box,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import theme from '../styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import CustomButton from '@/components/elements/CustomButton'
import { LoginInfo } from '@/features/login/types'
import { strage, pagePath } from '@/const/Consts'
import * as Dialog from '@/context/MessageDialog'
import { useHaveToken } from '@/hooks/useHaveToken'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import { haveTokenState } from '@/globalStates/haveToken'
import Login from '@/pages/login/index'

function Home() {
  const router = useRouter()
  const { haveToken, isAuthChecking } = useHaveToken()
  const setHaveToken = useSetRecoilState(haveTokenState)
  const isReady = router.isReady

  useEffect(() => {
    const token = localStorage.getItem(strage.Token)
    if (token != null) {
      setHaveToken(true)
      router.push(pagePath('cafes'))
    } else {
      setHaveToken(false)
      router.push(pagePath('login'))
    }
  }, [])

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

export default Home
