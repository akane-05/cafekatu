// import { NextPage } from 'next'
// import Router from 'next/router'
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControl,
  InputAdornment,
  InputLabel,
  IconButton,
  OutlinedInput,
  Hidden,
  FormHelperText,
  Link,
  Input,
} from '@mui/material'
import React, { useState, useRef, useEffect } from 'react'
import Review from '@/components/elements/ReviewCard'
import CustomPaper, { LinkPaper } from '@/components/elements/CustomPaper'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { pagePath, errStatus } from '@/const/Consts'
import { useRouter } from 'next/router'
import { useUserInfo } from '@/hooks/useUserInfo'
import * as yup from 'yup'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/styles/theme'
import { useUser } from '@/features/users/api/useUser'
import { updateUser } from '@/features/users/api/updateUser'
import { UserUpdInfo } from '@/features/users/types'
import { validate } from '@/lib/validate'
import * as Dialog from '@/context/MessageDialog'
import Error from '@/pages/_error'
import { userInfoState, UserInfo } from '@/globalStates/userInfo'
import { useSetRecoilState, RecoilRoot } from 'recoil'

export default function Mypage() {
  const router = useRouter()
  const dialog = Dialog.useDialogContext()
  const { response, isLoading, isError } = useUser(router.query.id)

  const [values, setValues] = React.useState<UserUpdInfo>({
    nickname: '',
    email: '',
    password: '',
    // newPassword: '',
    // newPasswordConfirm: '',
  })

  const [errors, setErrors] = React.useState<any>({})

  const [isEdit, setIsEdit] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  const setUserInfo = useSetRecoilState(userInfoState)

  // バリデーションルール
  const validScheme = () => {
    return yup.object().shape(
      {
        nickname: yup
          .string()
          .nullable()
          .matches(/^.{2,20}$/, {
            message: '2文字以上20文字以下で入力してください。',
            excludeEmptyString: true,
          })
          .when('email', (email, scheme) => {
            if (email) {
              return scheme.nullable()
            } else {
              return scheme.required(
                'nicknameまたはemailのどちらかは必須です。',
              )
            }
          }),
        email: yup
          .string()
          .email('正しいメールアドレスを入力してください。')
          .when('nickname', (nickname, scheme) => {
            if (nickname) {
              return scheme.nullable()
            } else {
              return scheme.required(
                'nicknameまたはemailのどちらかは必須です。',
              )
            }
          }),
        password: yup
          .string()
          .required('必須項目です')
          .matches(
            /^([a-zA-Z0-9]{8,20})$/,
            '半角英数字8文字以上20文字以下で入力してください。',
          ),
      },
      [['nickname', 'email']],
    )
  }

  const scheme = validScheme()

  const handleLink = (path: string) => {
    router.push(path)
  }

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()
  }

  const handleIsEdit = () => {
    setIsEdit(!isEdit)
  }

  const handleChange =
    (prop: keyof UserUpdInfo) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
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

    if (!error) {
      await dialog
        .confirm(Dialog.confirmDialog('ユーザー情報を更新しますか？'))
        .then(() => {
          update()
        })
    } else {
      dialog.confirm(Dialog.errorDialog('エラーを修正してください。'))
    }
  }

  const update = async () => {
    const res = await updateUser(response.data?.id, values)
    if (res.status == 200) {
      const userInfo: UserInfo = {
        id: res.id,
        nickname: res.nickname,
        email: res.email,
      }
      setUserInfo(userInfo)

      dialog.confirm(Dialog.apiOKDialog(res.message))
      handleLink(pagePath('cafes'))
    } else {
      if (errStatus.includes(res.status)) {
        router.push({
          pathname: pagePath('error'),
          query: { status: res.status, error: res.error },
        })
      } else {
        dialog.confirm(Dialog.apiErrorDialog(res.status, res.error))
      }
    }
  }

  if (isLoading) {
    return <span>読み込み中...</span>
  }

  if (isError) {
    return (
      <Error
        statusCode={isError.response ? isError.response.status : 500}
      ></Error>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <LinkPaper elevation={0}>
        <Link
          onClick={() => handleLink(pagePath('cafes'))}
          component="button"
          variant="body1"
        >
          店舗一覧に戻る
        </Link>
      </LinkPaper>

      <CustomPaper>
        <Paper sx={{ p: 2 }}>
          {!isEdit ? (
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={12}>
                <Typography
                  variant="h5"
                  gutterBottom
                  color="secondary"
                  sx={{ ml: 1 }}
                >
                  ユーザー情報
                </Typography>
              </Grid>

              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <TextField
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  variant="standard"
                  id="nickName"
                  label="nickName"
                  //defaultValue="ニックネーム"
                  value={response.data?.nickname}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={0} md={6}></Grid>

              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <TextField
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  variant="standard"
                  id="email"
                  label="email"
                  //defaultValue="email"
                  value={response.data?.email}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={0} md={6}></Grid>

              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                sx={{ mt: 1 }}
              >
                <Button
                  variant="contained"
                  onClick={handleIsEdit}
                  sx={{ mr: 1 }}
                >
                  編集
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  id="nickname"
                  label="nickname"
                  onChange={handleChange('nickname')}
                  //defaultValue={response.data?.email}
                  error={!!errors.nickname}
                  //error={true}
                  helperText={errors.nickname?.message}
                  value={values.nickname}
                />
              </Grid>
              <Grid item xs={0} md={6}></Grid>

              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  id="email"
                  label="email"
                  onChange={handleChange('email')}
                  // defaultValue={response.data?.email}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  value={values.email}
                />
              </Grid>
              <Grid item xs={0} md={6}></Grid>

              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <InputLabel htmlFor="password" shrink={true}>
                  現在のPassword
                </InputLabel>
                <Input
                  fullWidth
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
                  required={true}
                  error={!!errors.password}
                />
                <FormHelperText error id="password-error">
                  {errors.password?.message}
                </FormHelperText>
              </Grid>
              <Grid item xs={0} md={6}></Grid>

              {/* <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <InputLabel htmlFor="newPassword" shrink={true}>
                  新しいPassword
                </InputLabel>
                <Input
                  fullWidth
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={values.newPassword}
                  onChange={handleChange('newPassword')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle newPassword visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  error={errors.newPassword}
                />
                <FormHelperText error id="newPassword-error">
                  {errors.newPassword ? valideteErr.newPassword?.message : ''}
                </FormHelperText>
              </Grid>

              <Grid item xs={0} md={6}></Grid>

              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <InputLabel htmlFor="newPasswordConfirm" shrink={true}>
                  Password確認
                </InputLabel>
                <Input
                  fullWidth
                  id="newPasswordConfirm"
                  type={showPassword ? 'text' : 'password'}
                  value={values.newPasswordConfirm}
                  onChange={handleChange('newPasswordConfirm')}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle newPasswordConfirm visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  required={values.newPassword != '' ? true : false}
                  error={errors.newPasswordConfirm}
                />
                <FormHelperText error id="newPasswordConfirm-error">
                  {errors.newPasswordConfirm
                    ? valideteErr.newPasswordConfirm?.message
                    : ''}
                </FormHelperText>
              </Grid>

              <Grid item xs={0} md={6}></Grid> */}

              <Grid
                container
                direction="row"
                justifyContent="space-around"
                alignItems="center"
                spacing={1}
                sx={{ mt: 2, ml: 2 }}
              >
                <Grid item xs={12} sm={2}>
                  <Button
                    variant="contained"
                    onClick={handleIsEdit}
                    sx={{ mr: 2 }}
                  >
                    戻る
                  </Button>
                </Grid>

                <Grid item xs={0} sm={7}>
                  <Hidden></Hidden>
                </Grid>

                <Grid item xs={12} sm={3}>
                  <Button
                    variant="contained"
                    onClick={handleDialog}
                    sx={{ mr: 2 }}
                  >
                    変更
                  </Button>
                  <Button
                    onClick={() =>
                      handleLink(pagePath('withdrawal', response.data?.id))
                    }
                  >
                    退会
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          )}
          {/* </Paper> */}
        </Paper>
      </CustomPaper>
    </ThemeProvider>
  )
}
