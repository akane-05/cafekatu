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
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import React, { useState, useEffect } from 'react'
import CustomButton from '@/components/elements/CustomButton'
import { LoginInfo } from '@/features/login/types'
import { path, errStatus } from '@/const/Consts'
import { login } from '@/features/login/api/login'
import * as Dialog from '@/context/MessageDialog'
import { userInfoState, UserInfo } from '@/globalStates/userInfo'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import * as yup from 'yup'
import { validate } from '@/lib/validate'
import { useRouter } from 'next/router'

export default function Login() {
  const [values, setValues] = React.useState<LoginInfo>({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const [errors, setErrors] = useState<any>({})
  const setUserInfo = useSetRecoilState(userInfoState)

  // バリデーションルール
  const scheme = yup.object({
    email: yup
      .string()
      .required('必須項目です')
      .email('正しいメールアドレスを入力してください。'),
    password: yup
      .string()
      .required('必須項目です')
      .matches(
        /^([a-zA-Z0-9]{8,20})$/,
        '半角英数字8文字以上20文字以下で入力してください。',
      ),
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const handleChange =
    (prop: keyof LoginInfo) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const handleLink = (path: string) => {
    Router.push(path)
  }

  const dialog = Dialog.useDialogContext()
  const handleLogin = async () => {
    const errors = validate({ ...values }, scheme)
    setErrors(errors)
    let error = false
    for (const key of Object.keys(errors)) {
      if (errors[key]) {
        error = true
      }
    }

    if (!error) {
      const response = await login(values)
      if (response.status == 200) {
        const userInfo: UserInfo = {
          id: response.id,
          nickname: response.nickname,
          email: response.email,
        }
        setUserInfo(userInfo)

        dialog.confirm(Dialog.apiOKDialog(response.message))
        handleLink(path.cafes)
      } else {
        dialog.confirm(Dialog.apiErrorDialog(response.status, response.error))
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
              error={!!errors.email}
            />
            <FormHelperText error id="email-error">
              {errors.email?.message}
            </FormHelperText>
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
              error={!!errors.password}
            />
            <FormHelperText error id="password-error">
              {errors.password?.message}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <CustomButton variant="contained" onClick={() => handleLogin()}>
            ログイン
          </CustomButton>
        </Grid>

        <Grid item xs={12}>
          <CustomButton
            variant="contained"
            onClick={() => handleLink(path.register)}
          >
            新規会員登録
          </CustomButton>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}
