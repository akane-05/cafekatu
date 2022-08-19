import { NextPage } from 'next'
import Router from 'next/router'
import { Typography, Container, Grid, TextField, Button } from '@mui/material'
import theme from '../styles/theme'
import { ThemeProvider } from '@mui/material/styles'

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
          <Typography>TOP画面</Typography>
          <Typography>test</Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="text"
            label="キーワード"
            required
            // value={name}
            // error={hasNameError}
            // onChange={inputName}
            // helperText={hasNameError ? '名前を入力してください。' : ''}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={() => handleLink('./search/searchResult')}
          >
            検索
          </Button>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

export default Home
