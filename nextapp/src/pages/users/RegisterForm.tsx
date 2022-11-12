import { NextPage } from 'next'
import Router from 'next/router'
import {
  Grid,
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
import { RegisterInfo } from '@/features/register/types'
import { registerUser } from '@/features/register/api/registerUser'
//import { DialogOptions, useDialogContext } from '@/context/MessageDialog'
import * as Dialog from '@/context/MessageDialog'

import CustomButton from '@/components/elements/CustomButton'
import { validPattern } from '@/const/Consts'
import { resolve } from 'node:path/win32'

type ComfirmValue = {
  passwordConfirm: string
  showPassword: boolean
}

type InputValue = RegisterInfo & ComfirmValue

type Error = {
  nickname: boolean
  email: boolean
  password: boolean
  passwordConfirm: boolean
  [key: string]: boolean
}

export default function RegisterForm() {
  const dialog = Dialog.useDialogContext()

  const [values, setValues] = React.useState<InputValue>({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    showPassword: false,
  })

  const [errors, setErrors] = React.useState<Error>({
    nickname: false,
    email: false,
    password: false,
    passwordConfirm: false,
  })

  const nicknameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

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

  const handleDialog = async () => {
    await dialog.confirm(Dialog.confirmDialog('登録しますか？')).then(() => {
      register()
    })
  }

  const handleLink = (path: string) => {
    Router.push(path)
  }

  const handleChange =
    (prop: keyof InputValue) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let ref = null
      if (prop == 'password') {
        ref = passwordRef.current
        setErrors({
          ...errors,
          password: !ref?.validity.valid,
          passwordConfirm: event.target.value != values.passwordConfirm,
        })
      } else if (prop == 'passwordConfirm') {
        setErrors({
          ...errors,
          passwordConfirm: values.password != event.target.value,
        })
      } else {
        switch (prop) {
          case 'email':
            ref = emailRef.current
            break
          case 'nickname':
            ref = nicknameRef.current
            break
        }
        setErrors({ ...errors, [prop]: !ref?.validity.valid })
      }
      setValues({ ...values, [prop]: event.target.value })
    }

  const register = async () => {
    let error = false
    for (const key of Object.keys(errors)) {
      if (errors[key]) {
        error = true
      }
    }

    if (!error) {
      const returnInfo = await registerUser(values)
      if (returnInfo.status == 200) {
        await dialog
          .confirm(Dialog.apiOKDialog(returnInfo.message))
          .then(() => {
            console.log('画面遷移')
          })
      } else {
        await dialog.confirm(
          Dialog.apiErrorDialog(returnInfo.status, returnInfo.error),
        )
      }
    } else {
      await dialog.confirm(Dialog.errorDialog())
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
            <InputLabel htmlFor="nickname">ニックネーム</InputLabel>
            <OutlinedInput
              id="nickname"
              type="text"
              value={values.nickname}
              onChange={handleChange('nickname')}
              label="nickname"
              required={true}
              error={errors.nickname}
              inputProps={{ pattern: validPattern.nickname }}
              inputRef={nicknameRef}
            />
          </FormControl>
          {errors.nickname && (
            <FormHelperText error id="nickname-error">
              2文字以上20文字以下で入力してください。
            </FormHelperText>
          )}
        </Grid>

        <Grid item xs={12}>
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="email">email</InputLabel>
            <OutlinedInput
              id="email"
              type="text"
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
              label="passwordConfirm"
              required={true}
              error={errors.passwordConfirm}
            />
            {errors.passwordConfirm && (
              <FormHelperText error id="passwordConfirm-error">
                パスワードが一致しません。
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <CustomButton variant="contained" onClick={() => handleDialog()}>
            登録
          </CustomButton>
        </Grid>

        <Grid item xs={12}>
          <CustomButton variant="contained" onClick={() => handleLink('../')}>
            Top
          </CustomButton>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}
