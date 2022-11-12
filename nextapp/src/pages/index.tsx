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
import theme from '../styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import React, { useState, useRef } from 'react'
import { styled } from '@mui/system'
import { truncate } from 'fs'
import CustomButton from '@/components/elements/CustomButton'

type State = {
  email: string
  password: string
  showPassword: boolean
}

type Error = {
  email: boolean
  password: boolean
}

function Home() {
  const [values, setValues] = React.useState<State>({
    email: '',
    password: '',
    showPassword: false,
  })

  const [errors, setErrors] = React.useState<Error>({
    email: false,
    password: false,
  })

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const emailVaildPattern =
    '^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*.)+[a-zA-Z]{2,}$'
  const passwordVaildPattern = '^([a-zA-Z0-9]{8})$'

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

  const handleLink = (path: string) => {
    Router.push(path)
  }

  const login = () => {
    // Router.push(path)
  }

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let ref = null
      if (prop == 'email') {
        ref = emailRef.current
      } else if (prop == 'password') {
        ref = passwordRef.current
      }
      setErrors({ ...errors, [prop]: !ref?.validity.valid })

      setValues({ ...values, [prop]: event.target.value })
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
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="email">email</InputLabel>
            <OutlinedInput
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              label="email"
              required={true}
              error={errors.email}
              inputProps={{ pattern: emailVaildPattern }}
              inputRef={emailRef}
            />
            {errors.email && (
              <FormHelperText error id="email-error">
                メールアドレスを入力してください。
              </FormHelperText>
            )}
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
              label="password"
              required={true}
              error={errors.password}
              inputProps={{ pattern: passwordVaildPattern }}
              inputRef={passwordRef}
            />
            {errors.password && (
              <FormHelperText error id="password-error">
                半角英数字8桁で入力してください。
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <CustomButton variant="contained" onClick={() => login()}>
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
