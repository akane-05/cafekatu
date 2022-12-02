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
} from '@mui/material'
import React, { useState, useRef } from 'react'
import Review from '@/components/elements/ReviewCard'
import CustomPaper, { LinkPaper } from '@/components/layouts/CustomPaper'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { path, strage, requests } from '@/const/Consts'
import { useRouter } from 'next/router'
import { useUserInfo } from '@/hooks/useUserInfo'

type Props = {
  num: number
}

type Current = {
  nickname: string
  email: string
}

type State = {
  isEdit: boolean
  showPassword: boolean
  nickname: string
  email: string
  password: string
  newPassword: string
  newPasswordConfirm: string
}

type Error = {
  nickname: boolean
  email: boolean
  password: boolean
  newPassword: boolean
  newPasswordConfirm: boolean
}

export default function Mypage(props: Props) {
  const router = useRouter()
  const { userInfo } = useUserInfo()
  const current: Current = {
    nickname: '変更前のnick',
    email: '変更前のemail',
  }

  const [values, setValues] = React.useState<State>({
    isEdit: false,
    showPassword: false,
    nickname: '',
    email: '',
    password: '',
    newPassword: '',
    newPasswordConfirm: '',
  })

  const [errors, setErrors] = React.useState<any>({})

  const handleLink = (path: string) => {
    router.push(path)
  }

  const handleIsEdit = () => {
    setValues({
      ...values,
      isEdit: !values.isEdit,
    })
  }

  const handleWithdrawal = () => {}

  const handleIsUpdate = () => {}

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

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  return (
    <>
      <LinkPaper elevation={0}>
        <Link
          onClick={() => handleLink(path.cafesList)}
          component="button"
          variant="body1"
        >
          店舗一覧に戻る
        </Link>
      </LinkPaper>

      <CustomPaper>
        <Paper sx={{ p: 2, m: 1 }}>
          {!values.isEdit ? (
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
                  fullWidth
                  variant="standard"
                  id="nickName"
                  label="nickName"
                  //defaultValue="ニックネーム"
                  value={userInfo?.nickname}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>

              <Grid item xs={0} md={6}></Grid>

              <Grid item xs={12} md={6} sx={{ p: 1 }}>
                <TextField
                  fullWidth
                  variant="standard"
                  id="email"
                  label="email"
                  //defaultValue="email"
                  value={userInfo?.email}
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
                  sx={{ mr: 2 }}
                >
                  編集
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="space-around"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                  <InputLabel htmlFor="nickname">ニックネーム</InputLabel>
                  <OutlinedInput
                    id="nickname"
                    type="text"
                    defaultValue={current.nickname}
                    value={values.nickname}
                    onChange={handleChange('nickname')}
                    label="nickname"
                    error={!!errors.nickname}
                  />
                </FormControl>
                {errors.nickname && (
                  <FormHelperText error id="nickname-error">
                    2文字以上20文字以下で入力してください。
                  </FormHelperText>
                )}
                {/*
                 <TextField
                  id="nickName"
                  label="nickName"
                  defaultValue="ニックネーム"
                /> */}
              </Grid>
              <Grid item xs={12}>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                  <InputLabel htmlFor="email">email</InputLabel>
                  <OutlinedInput
                    id="email"
                    type="text"
                    defaultValue={current.email}
                    value={values.email}
                    onChange={handleChange('email')}
                    label="email"
                    error={!!errors.email}
                  />
                  {errors.email && (
                    <FormHelperText error id="email-error">
                      メールアドレスを入力してください。
                    </FormHelperText>
                  )}
                </FormControl>

                {/* <TextField id="email" label="email" defaultValue="email" /> */}
              </Grid>

              <Grid item xs={12}>
                <FormControl sx={{ width: '25ch' }} variant="outlined">
                  <InputLabel htmlFor="password">現在のPassword</InputLabel>
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
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="現在のPassword"
                    required={true}
                    error={!!errors.password}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl sx={{ width: '25ch' }} variant="outlined">
                  <InputLabel htmlFor="newPassword">新しいPassword</InputLabel>
                  <OutlinedInput
                    id="newPassword"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.newPassword}
                    onChange={handleChange('newPassword')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="新しいPassword"
                    error={!!errors.newPassword}
                  />
                  {errors.newPassword && (
                    <FormHelperText error id="newPassword-error">
                      半角英数字8桁で入力してください。
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl sx={{ width: '25ch' }} variant="outlined">
                  <InputLabel htmlFor="newPasswordConfirm">
                    Password確認
                  </InputLabel>
                  <OutlinedInput
                    id="newPasswordConfirm"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.newPasswordConfirm}
                    onChange={handleChange('newPasswordConfirm')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password確認"
                    required={values.newPassword != '' ? true : false}
                    error={errors.newPasswordConfirm}
                  />
                  {errors.newPasswordConfirm && (
                    <FormHelperText error id="newPasswordConfirm-error">
                      パスワードが一致しません。
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>

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
                    onClick={handleIsUpdate}
                    sx={{ mr: 2 }}
                  >
                    変更
                  </Button>
                  <Button
                    //   variant="contained"
                    onClick={handleWithdrawal}
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

      {/* <CustomPaper sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom color="primary">
          過去の口コミ
        </Typography>

        {response.response.data.reviews?.map((review: Review) => {
          return <ReviewCard key={review.id} review={review} /> //keyを指定
        })}
      </CustomPaper> */}
    </>
  )
}
