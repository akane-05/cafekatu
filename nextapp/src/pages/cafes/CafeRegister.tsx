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
} from '@mui/material'
import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import CustomPaper from '@/components/layouts/CustomPaper'

type Props = {
  num: number
}

type State = {
  name: string
  postCode: string
  prefectureId: number
  city: string
  street: string
  businessHours: string
}

type Error = {
  name: boolean
  postCode: boolean
  prefectureId: boolean
  city: boolean
  street: boolean
  businessHours: boolean
}

export default function CafeRegister(props: Props) {
  const [values, setValues] = React.useState<State>({
    name: '',
    postCode: '',
    prefectureId: 0,
    city: '',
    street: '',
    businessHours: '',
  })

  const [errors, setErrors] = React.useState<Error>({
    name: false,
    postCode: false,
    prefectureId: false,
    city: false,
    street: false,
    businessHours: false,
  })

  const nameRef = useRef<HTMLInputElement>(null)
  const postCodeRef = useRef<HTMLInputElement>(null)
  const prefectureRef = useRef<HTMLInputElement>(null)
  const cityRef = useRef<HTMLInputElement>(null)
  const streetRef = useRef<HTMLInputElement>(null)
  const businessHoursRef = useRef<HTMLInputElement>(null)

  const cafeVaildPattern = '^.{1,250}$'
  const postCodeVaildPattern = '[0-9]{7}'
  const cityVaildPattern = '^.{1,20}$'
  const streetVaildPattern = '^.{1,250}$'
  const businessHoursVaildPattern = '^.{1,250}$'

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      let ref = null
      switch (prop) {
        case 'name':
          ref = nameRef.current
          break
        case 'postCode':
          ref = postCodeRef.current
          break
        case 'prefectureId':
          ref = prefectureRef.current
          break
        case 'city':
          ref = cityRef.current
          break
        case 'street':
          ref = streetRef.current
          break
        case 'businessHours':
          ref = businessHoursRef.current
          break
      }
      setErrors({ ...errors, [prop]: !ref?.validity.valid })

      setValues({ ...values, [prop]: event.target.value })
    }

  return (
    <ThemeProvider theme={theme}>
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
              <Typography variant="h5">店舗名</Typography>
            </Grid>

            <Grid item xs={12}>
              {/* <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined"> */}
              <FormControl
                // sx={{ m: 1, width: 'auto' }}
                fullWidth={true}
                variant="outlined"
              >
                <InputLabel htmlFor="name">店舗名</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange('name')}
                  label="name"
                  required={true}
                  error={errors.name}
                  inputProps={{ required: true, pattern: cafeVaildPattern }}
                  inputRef={nameRef}
                />
                {errors.name && (
                  <FormHelperText error id="name-error">
                    必須項目です。
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">住所</Typography>
            </Grid>

            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="postCode">郵便番号</InputLabel>
                <OutlinedInput
                  id="postCode"
                  type="text"
                  value={values.postCode}
                  onChange={handleChange('postCode')}
                  label="postCode"
                  required={true}
                  error={errors.postCode}
                  inputProps={{ required: true, pattern: postCodeVaildPattern }}
                  inputRef={postCodeRef}
                />
                {errors.postCode && (
                  <FormHelperText error id="postCode-error">
                    必須項目です。半角数字7桁で入力してください。
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="prefectureId">都道府県</InputLabel>
                <OutlinedInput
                  id="prefectureId"
                  type="text"
                  value={values.prefectureId}
                  onChange={handleChange('prefectureId')}
                  label="prefectureId"
                  required={true}
                  error={errors.prefectureId}
                  inputProps={{ required: true }}
                  inputRef={prefectureRef}
                />
                {errors.prefectureId && (
                  <FormHelperText error id="prefectureId-error">
                    必須項目です。
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="city">市区町村</InputLabel>
                <OutlinedInput
                  id="city"
                  type="text"
                  value={values.city}
                  onChange={handleChange('city')}
                  label="city"
                  required={true}
                  error={errors.city}
                  inputProps={{ required: true, pattern: cityVaildPattern }}
                  inputRef={cityRef}
                />
                {errors.city && (
                  <FormHelperText error id="city-error">
                    必須項目です。
                  </FormHelperText>
                )}
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
                  error={errors.street}
                  inputProps={{ required: true, pattern: streetVaildPattern }}
                  inputRef={streetRef}
                />
                {errors.street && (
                  <FormHelperText error id="street-error">
                    必須項目です。
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h5">営業時間</Typography>
            </Grid>

            <TextField
              id="businessHours"
              label="営業時間"
              multiline
              fullWidth
              rows={10}
              defaultValue="営業時間"
              sx={{ mt: 1, mb: 1 }}
              onChange={handleChange('businessHours')}
              required={true}
              error={errors.businessHours}
              inputProps={{
                required: true,
                pattern: businessHoursVaildPattern,
              }}
              inputRef={businessHoursRef}
              helperText={
                errors.businessHours &&
                '必須項目です。250字以内で入力してください。'
              }
            />

            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button variant="contained">投稿</Button>
            </Grid>
          </Grid>
        </Paper>
      </CustomPaper>
    </ThemeProvider>
  )
}
