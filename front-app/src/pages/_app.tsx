// import Head from 'next/head'
// import type { AppProps } from 'next/app'
// import { ThemeProvider } from '@mui/material/styles'
// import CssBaseline from '@mui/material/CssBaseline'
// import { CacheProvider, EmotionCache } from '@emotion/react'
// import theme from '../style/theme'
// import createEmotionCache from '../createEmotionCache'

// const clientSideEmotionCache = createEmotionCache()
// interface MyAppProps extends AppProps {
//   emotionCache?: EmotionCache
// }

// function MyApp(props: MyAppProps) {
//   const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
//   return (
//     <CacheProvider value={emotionCache}>
//       <Head>
//         <meta name="viewport" content="initial-scale=1, width=device-width" />
//       </Head>
//       <ThemeProvider theme={theme}>
//         <CssBaseline />
//         <Component {...pageProps} />
//       </ThemeProvider>
//     </CacheProvider>
//   )
// }

// export default MyApp

import type { AppProps } from 'next/app'
import { default as Layout } from '../components/layouts/Layout'
import theme from '../styles/theme'
import '../styles/global.css'
import { ThemeProvider } from '@mui/material/styles'

import { QueryClientProvider } from 'react-query'
import { queryClient } from '@/lib/react-query'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default MyApp