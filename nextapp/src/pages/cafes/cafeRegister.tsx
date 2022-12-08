// import { NextPage } from 'next'
// import Router from 'next/router'
import React, { useState, useRef } from 'react'
import {
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  FormHelperText,
  Box,
  Select,
  MenuItem,
  SelectChangeEvent,
  Link,
} from '@mui/material'
import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import CustomPaper, { LinkPaper } from '@/components/elements/CustomPaper'
import { Cafe } from '@/features/cafes/types'
import * as yup from 'yup'
import { validate } from '@/lib/validate'
import * as Dialog from '@/context/MessageDialog'
import { path } from '@/const/Consts'
import { useRouter } from 'next/router'
import { postCafe } from '@/features/cafes/api/postCafe'
import { usePrefecture } from '@/features/unit/api/usePrefecture'
import { makeStyles } from '@mui/styles'
import { Prefectures } from '@/features/unit/types/index'
import Error from '@/pages/_error'

const useStyles = makeStyles((theme) => ({
  menuPaper: {
    mixHeight: 100,
    maxHeight: 200,
  },
}))

export default function CafeRegister() {
  const { response, isLoading, isError } = usePrefecture()
  const router = useRouter()
  const dialog = Dialog.useDialogContext()
  const classes = useStyles()
  const [values, setValues] = React.useState<Cafe>({
    name: '',
    zipcode: '',
    prefecture_id: 1,
    city: '',
    street: '',
    business_hours: '',
  })

  const [errors, setErrors] = React.useState<any>({})

  // バリデーションルール
  const scheme = yup.object({
    name: yup
      .string()
      .required('必須項目です')
      .matches(/^.{1,250}$/, '250文字以下で入力してください。'),
    zipcode: yup
      .string()
      .required('必須項目です')
      .matches(/^([0-9]{7})$/, '半角数字7桁で入力してください。'),
    city: yup
      .string()
      .required('必須項目です')
      .matches(/^.{1,250}$/, '20文字以下で入力してください。'),
    street: yup
      .string()
      .required('必須項目です')
      .matches(/^.{1,250}$/, '250文字以下で入力してください。'),
    business_hours: yup
      .string()
      .required('必須項目です')
      .matches(/^.{1,250}$/, '250文字以下で入力してください。'),
  })

  const handleChange =
    (prop: keyof Cafe) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  const handleLink = (path: string) => {
    router.push(path)
  }

  const handleSelect = (event: SelectChangeEvent<any>) => {
    const value = event.target.value as number

    setValues({ ...values, ['prefecture_id']: value })
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
        .confirm(Dialog.confirmDialog('店舗登録しますか？'))
        .then(() => {
          register()
        })
    } else {
      dialog.confirm(Dialog.errorDialog('エラーを修正してください。'))
    }
  }

  const register = async () => {
    const response = await postCafe(values)
    if (response.status == 200) {
      dialog.confirm(Dialog.apiOKDialog(response.message))
      handleLink(path.cafesList)
    } else {
      if (response.status == 401) {
        handleLink(path.top)
      }
      dialog.confirm(Dialog.apiErrorDialog(response.status, response.error))
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
          onClick={() => handleLink(path.cafesList)}
          component="button"
          variant="body1"
        >
          店舗一覧に戻る
        </Link>
      </LinkPaper>

      <CustomPaper>
        <Paper
          elevation={2}
          sx={{
            padding: 4,
          }}
        >
          <Grid
            container
            rowSpacing={1}
            alignItems="center"
            justifyContent="center"
            //   direction="column"
          >
            <Grid item xs={12}>
              <Typography
                variant="h5"
                gutterBottom
                color="secondary"
                sx={{ ml: 1 }}
              >
                店舗登録
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                color="secondary"
                sx={{ ml: 1 }}
              >
                ＜店名＞
              </Typography>
            </Grid>

            <Grid item xs={12}>
              {/* <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined"> */}
              <FormControl
                // sx={{ m: 1, width: 'auto' }}
                fullWidth={true}
                variant="outlined"
              >
                <InputLabel htmlFor="name">店名</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange('name')}
                  label="name"
                  required={true}
                  error={!!errors.name}
                />
                <FormHelperText error id="name-error">
                  {errors.name?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ m: 1 }}></Box>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                color="secondary"
                sx={{ ml: 1 }}
              >
                ＜住所＞
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl sx={{ width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="postCode">郵便番号</InputLabel>
                <OutlinedInput
                  id="postCode"
                  type="text"
                  value={values.zipcode}
                  onChange={handleChange('zipcode')}
                  label="zipcode"
                  required={true}
                  error={!!errors.postCode}
                />
                <FormHelperText error id="zipcpde-error">
                  {errors.zipcode?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl sx={{ width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="prefecture_id">都道府県</InputLabel>
                <Select
                  labelId="prefecture_id"
                  id="prefecture_id"
                  label="都道府県"
                  value={values.prefecture_id}
                  required={true}
                  onChange={handleSelect}
                  inputProps={{
                    required: true,
                  }}
                  MenuProps={{ classes: { paper: classes.menuPaper } }}
                >
                  {response.data?.map((prefecture: Prefectures) => (
                    <MenuItem key={prefecture.id} value={prefecture.id}>
                      {prefecture.prefecture}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl sx={{ width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="city">市区町村</InputLabel>
                <OutlinedInput
                  id="city"
                  type="text"
                  value={values.city}
                  onChange={handleChange('city')}
                  label="city"
                  required={true}
                  error={!!errors.city}
                />
                <FormHelperText error id="city-error">
                  {errors.city?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                // sx={{ m: 1, width: '25ch' }}
                fullWidth={true}
                variant="outlined"
              >
                <InputLabel htmlFor="street">町名番地</InputLabel>
                <OutlinedInput
                  id="street"
                  type="text"
                  value={values.street}
                  onChange={handleChange('street')}
                  label="street"
                  required={true}
                  error={!!errors.street}
                />
                <FormHelperText error id="street-error">
                  {errors.street?.message}
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="h6"
                gutterBottom
                color="secondary"
                sx={{ ml: 1 }}
              >
                ＜営業時間＞
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="business_hours"
                label="営業時間"
                multiline
                fullWidth
                rows={10}
                //sx={{ mt: 1, mb: 1 }}
                onChange={handleChange('business_hours')}
                required={true}
                error={!!errors.business_hours}
                helperText={errors.business_hours?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ m: 1 }}></Box>
            </Grid>

            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button variant="contained" onClick={handleDialog}>
                投稿
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </CustomPaper>
    </ThemeProvider>
  )
}
