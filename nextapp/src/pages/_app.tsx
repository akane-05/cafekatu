import type { AppProps } from 'next/app'
import { default as Layout } from '../components/layouts/Layout'
import theme from '../styles/theme'
import '../styles/global.css'
import { ThemeProvider } from '@mui/material/styles'
import { MessageDialog } from '@/context/MessageDialog'
import React, { useState, useEffect } from 'react'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import NextNprogress from 'nextjs-progressbar'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <NextNprogress />
        <MessageDialog>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MessageDialog>
      </ThemeProvider>
    </RecoilRoot>
  )
}

export default MyApp
