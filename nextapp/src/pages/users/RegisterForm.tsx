import { NextPage } from 'next'
import Router from 'next/router'
import {
  Grid,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Paper,
  Dialog,
  DialogActions,
  DialogTitle,
  FormHelperText,
} from '@mui/material'
import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import React, { useState, useRef } from 'react'
import { styled } from '@mui/system'

interface State {
  email: string
  password: string
  passwordConfirm: string
  nickname: string
  showPassword: boolean
}

interface Error {
  nickname: boolean
  email: boolean
  password: boolean
  passwordConfirm: boolean
}

export default function RegisterForm() {
  const CustomButton = styled(Button)(() => ({
    maxWidth: '120px',
    minWidth: '120px',
  }))

  const [values, setValues] = React.useState<State>({
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

  const [open, setOpen] = React.useState(false)

  const nicknameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)

  const nicknameValidPattern = '^.{2,20}$'
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

  const handleDialog = (e: boolean) => {
    setOpen(e)
  }

  const handleLink = (path: string) => {
    Router.push(path)
  }

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
              inputProps={{ pattern: nicknameValidPattern }}
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
          <CustomButton variant="contained" onClick={() => handleDialog(true)}>
            登録
          </CustomButton>
        </Grid>

        <Grid item xs={12}>
          <CustomButton variant="contained" onClick={() => handleLink('../')}>
            Top
          </CustomButton>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClick={() => handleDialog(false)}
        fullWidth={true}
        maxWidth="xs"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'登録しますか？'}</DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={() => handleDialog(false)}>いいえ</Button>
          <Button onClick={() => handleDialog(false)} autoFocus>
            はい
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}
