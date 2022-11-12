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
} from '@mui/material'
import React, { useState, useRef } from 'react'
import Comment from '@/components/elements/Comment'
import CustomPaper from '@/components/layouts/CustomPaper'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { validPattern } from '@/const/Consts'

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

  const [errors, setErrors] = React.useState<Error>({
    nickname: false,
    email: false,
    password: false,
    newPassword: false,
    newPasswordConfirm: false,
  })

  const nicknameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const newPasswordRef = useRef<HTMLInputElement>(null)

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
      let ref = null
      if (prop == 'newPassword') {
        ref = newPasswordRef.current
        setErrors({
          ...errors,
          newPassword: !ref?.validity.valid,
          newPasswordConfirm: event.target.value != values.newPasswordConfirm,
        })
      } else if (prop == 'newPasswordConfirm') {
        setErrors({
          ...errors,
          newPasswordConfirm: values.newPassword != event.target.value,
        })
      } else {
        switch (prop) {
          case 'email':
            ref = emailRef.current
            break
          case 'nickname':
            ref = nicknameRef.current
            break
          case 'password':
            ref = passwordRef.current
            break
        }
        setErrors({ ...errors, [prop]: !ref?.validity.valid })
      }
      setValues({ ...values, [prop]: event.target.value })
    }

  return (
    <>
      <CustomPaper elevation={0} sx={{ backgroundColor: 'transparent' }}>
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button
            variant="contained"
            // onClick={() => handleLink('./search/searchResult')}
          >
            店舗一覧に戻る
          </Button>
          <Button
            variant="contained"
            // onClick={() => handleLink('./search/searchResult')}
          >
            お気に入り店舗
          </Button>
        </Grid>
      </CustomPaper>

      <CustomPaper sx={{ mt: 1 }}>
        <Typography variant="h5" gutterBottom color="primary">
          ユーザー情報
        </Typography>

        {!values.isEdit ? (
          <Paper sx={{ padding: 2 }}>
            <Grid
              container
              spacing={2}
              direction="column"
              justifyContent="space-around"
              alignItems="flex-start"
            >
              <Grid item xs={12}>
                <TextField
                  id="nickName"
                  label="nickName"
                  defaultValue="ニックネーム"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  label="email"
                  defaultValue="email"
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
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
          </Paper>
        ) : (
          <Paper sx={{ padding: 2 }}>
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
                    error={errors.password}
                    inputProps={{ pattern: validPattern.password }}
                    inputRef={passwordRef}
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
                    error={errors.newPassword}
                    inputProps={{ pattern: validPattern.password }}
                    inputRef={newPasswordRef}
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
                    onClick={handleIsUpdate}
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
          </Paper>
        )}
      </CustomPaper>

      <CustomPaper sx={{ mt: 2 }}>
        <Typography variant="h5" gutterBottom color="primary">
          過去の口コミ
        </Typography>

        <Comment mypage={true}></Comment>
      </CustomPaper>
    </>
  )
}
