import type { AppProps } from 'next/app'
import { default as Layout } from '../components/layouts/Layout'
import theme from '../styles/theme'
import '../styles/global.css'
import { ThemeProvider } from '@mui/material/styles'
import { MessageDialog } from '@/context/MessageDialog'
import { TokenProvide } from '@/context/TokenProvide'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      {/* <TokenProvide> */}
      <MessageDialog>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MessageDialog>
      {/* </TokenProvide> */}
    </ThemeProvider>
  )
}

export default MyApp
