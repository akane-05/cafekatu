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
import { UserRgsInfo } from '@/features/register/types'
import { registerUser } from '@/features/register/api/registerUser'
import * as Dialog from '@/context/MessageDialog'
import CustomButton from '@/components/elements/CustomButton'
import { path, errStatus } from '@/const/Consts'
import * as yup from 'yup'
import { validate } from '@/lib/validate'
import { userInfoState, UserInfo } from '@/globalStates/userInfo'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import { useRouter } from 'next/router'

type InputValue = UserRgsInfo & {
  passwordConfirm: ''
}

export default function RegisterForm() {
  const router = useRouter()
  const dialog = Dialog.useDialogContext()

  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  const [values, setValues] = React.useState<InputValue>({
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })

  const [errors, setErrors] = React.useState<any>({})

  const setUserInfo = useSetRecoilState(userInfoState)

  // バリデーションルール
  const scheme = yup.object({
    nickname: yup
      .string()
      .required('必須項目です')
      .matches(/^.{2,20}$/, '2文字以上20文字以下で入力してください。'),
    email: yup
      .string()
      .required('必須項目です')
      .email('正しいメールアドレスを入力してください。'),
    password: yup
      .string()
      .required('必須項目です')
      .matches(/^([a-zA-Z0-9]{8})$/, '半角英数字8桁で入力してください。'),
    passwordConfirm: yup
      .string()
      .required('必須項目です')
      .matches(
        /^([a-zA-Z0-9]{8,20})$/,
        '半角英数字8文字以上20文字以下で入力してください。',
      )
      .oneOf([yup.ref('password'), null], '確認用パスワードが一致していません'),
  })

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const handleDialog = async () => {
    const errors = validate({ ...values }, scheme)
    setErrors(errors)
    let error = false
    for (const key of Object.keys(errors)) {
      if (errors[key]) {
        error = true
      }
    }
    dialog.confirm(Dialog.errorDialog('エラーを修正してください。'))
  }

  const handleLink = (path: string) => {
    Router.push(path)
  }

  const handleChange =
    (prop: keyof InputValue) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const register = async () => {
    const response = await registerUser(values)
    if (response.status == 200) {
      const userInfo: UserInfo = {
        id: response.id,
        nickname: response.nickname,
        email: response.email,
      }
      setUserInfo(userInfo)

      dialog.confirm(Dialog.apiOKDialog(response.message))
      handleLink(path.cafesList)
    } else {
      if (errStatus.includes(response.status)) {
        router.push({
          pathname: path.error,
          query: { status: response.status, error: response.error },
        })
      } else {
        dialog.confirm(Dialog.apiErrorDialog(response.status, response.error))
      }
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
              error={!!errors.nickname}
            />
          </FormControl>
          <FormHelperText error id="nickname-error">
            {errors.nickname?.message}
          </FormHelperText>
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
          <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
            <InputLabel htmlFor="password confirm">Password確認</InputLabel>
            <OutlinedInput
              id="password confirm"
              type={showPassword ? 'text' : 'password'}
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
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="passwordConfirm"
              required={true}
              error={!!errors.passwordConfirm}
            />
            <FormHelperText error id="passwordConfirm-error">
              {errors.passwordConfirm?.message}
            </FormHelperText>
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
