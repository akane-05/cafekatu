import type { AppProps } from 'next/app'
import { default as Layout } from '../components/layouts/Layout'
import theme from '../styles/theme'
import '../styles/global.css'
import { ThemeProvider } from '@mui/material/styles'
import { MessageDialog } from '@/context/MessageDialog'
import React, { useState, useEffect } from 'react'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import { haveTokenState } from '@/globalStates/haveToken'

function AppInit() {
  // グローバルステートにユーザー情報をセットするためのもの
  const setHaveToken = useSetRecoilState(haveTokenState)

  useEffect(() => {
    console.log('トークン取得前')
    const haveToken = localStorage.getItem('token')
    console.log(haveToken)
    if (haveToken != null) {
      console.log('トークンあった')
      setHaveToken(true)
    } else {
      console.log('トークンない')
      setHaveToken(false)
    }
    console.log(haveToken)
  }, [])

  return null
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <MessageDialog>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MessageDialog>
      </ThemeProvider>
      <AppInit />
    </RecoilRoot>
  )
}

export default MyApp
