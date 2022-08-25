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
  Paper,
} from '@mui/material'
import theme from 'styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import React, { useState } from 'react'
import { styled } from '@mui/system'

interface State {
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  showPassword: boolean
}

export default function RegisterForm() {
  const [values, setValues] = React.useState<State>({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    showPassword: false,
  })

  const CustomButton = styled(Button)(() => ({
    maxWidth: '120px',
    // maxHeight: '30px',
    minWidth: '120px',
    // minHeight: '30px',
  }))

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    })
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={1}
        sx={{
          margin: 'auto',
          maxWidth: 600,
          backgroundColor: '#f6f1f3',
          pd: 2,
        }}
      >
        <Grid
          container
          rowSpacing={1}
          alignItems="center"
          justifyContent="center"
          direction="column"
        >
          <Grid item xs={12}>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="email">email</InputLabel>
              <OutlinedInput
                id="email"
                type="text"
                value={values.email}
                onChange={handleChange('email')}
                label="email"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={values.showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="password confirm">Password確認</InputLabel>
              <OutlinedInput
                id="password confirm"
                type={values.showPassword ? 'text' : 'password'}
                value={values.passwordConfirm}
                onChange={handleChange('passwordConfirm')}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="password confirm"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {values.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="nickname">ニックネーム</InputLabel>
              <OutlinedInput
                id="nickname"
                type="text"
                value={values.nickname}
                onChange={handleChange('nickname')}
                label="nickname"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <CustomButton
              variant="contained"
              // onClick={() => handleLink('./search/searchResult')}
            >
              登録
            </CustomButton>
          </Grid>

          <Grid item xs={12}>
            <CustomButton
              variant="contained"
              // onClick={() => handleLink('./search/searchResult')}
            >
              Top
            </CustomButton>
          </Grid>
        </Grid>
      </Paper>
    </ThemeProvider>
  )
}
