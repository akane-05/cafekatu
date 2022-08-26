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
} from '@mui/material'
import React, { useState } from 'react'
import Comment from 'components/elements/comment'
import CustomPaper from 'components/layouts/customPaper'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

interface Props {
  num: number
}

interface State {
  isEdit: boolean
  showPassword: boolean

  password: string
  newPassword: string
  newPasswordConfirm: string
}

export default function CafeDetail(props: Props) {
  const [values, setValues] = React.useState<State>({
    isEdit: false,
    showPassword: false,
    password: '',
    newPassword: '',
    newPasswordConfirm: '',
  })

  const handleIsEdit = () => {
    setValues({
      ...values,
      isEdit: !values.isEdit,
    })
  }

  const handleWithdrawal = () => {}

  const handleIsUpdate = () => {}

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
              <Grid item xs={12}>
                <TextField
                  id="creatDate"
                  label="登録日"
                  type="date"
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
                <TextField
                  id="nickName"
                  label="nickName"
                  defaultValue="ニックネーム"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField id="email" label="email" defaultValue="email" />
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
                  />
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
                  />
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
