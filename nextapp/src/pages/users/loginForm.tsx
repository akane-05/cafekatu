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
import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import React, { useState, useRef } from 'react'
import { styled } from '@mui/system'
import { truncate } from 'fs'
import CustomButton from '@/components/elements/CustomButton'
import { validPattern, path } from '@/const/Consts'
import { LoginInfo } from '@/features/login/types'
import { login } from '@/features/login/api/login'
import * as Dialog from '@/context/MessageDialog'
//import path from '@/const/Consts'

type Error = {
  email: boolean
  password: boolean
  [key: string]: boolean
}

export default function RegisterForm() {
  const [values, setValues] = React.useState<LoginInfo>({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  const [errors, setErrors] = React.useState<Error>({
    email: false,
    password: false,
  })

  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const handleLink = (path: string) => {
    Router.push(path)
  }

  const dialog = Dialog.useDialogContext()

  const handleChange =
    (prop: keyof LoginInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let ref = null
      if (prop == 'email') {
        ref = emailRef.current
      } else if (prop == 'password') {
        ref = passwordRef.current
      }
      setErrors({ ...errors, [prop]: !ref?.validity.valid })

      setValues({ ...values, [prop]: event.target.value })
    }

  const handleLogin = async () => {
    let error = false
    for (const key of Object.keys(errors)) {
      if (errors[key]) {
        error = true
      }
    }

    if (!error) {
      const returnInfo = await login(values)
      if (returnInfo.status == 200) {
        // await dialog
        //   .confirm(Dialog.apiOKDialog(returnInfo.message))
        //   .then(() => {
        //     handleLink(path.cafesList)
        //   })
        dialog.confirm(Dialog.apiOKDialog(returnInfo.message))
        handleLink(path.cafesList)
      } else {
        dialog.confirm(
          Dialog.apiErrorDialog(returnInfo.status, returnInfo.error),
        )
      }
    } else {
      dialog.confirm(Dialog.errorDialog('エラーを修正してください。'))
    }
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
              inputProps={{ pattern: validPattern.email }}
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
              type={showPassword ? 'text' : 'password'}
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
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="password"
              required={true}
              error={errors.password}
              inputProps={{ pattern: validPattern.password }}
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
          <CustomButton variant="contained" onClick={() => handleLogin()}>
            ログイン
          </CustomButton>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}
