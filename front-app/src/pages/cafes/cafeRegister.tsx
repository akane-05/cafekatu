// import { NextPage } from 'next'
// import Router from 'next/router'
import React, { useState } from 'react'
import {
  Typography,
  Grid,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
} from '@mui/material'
import theme from 'styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import CustomPaper from 'components/layouts/customPaper'

interface Props {
  num: number
}

interface State {
  name: string
  postCode: string
  prefectureId: number
  city: string
  street: string
  businessHours: string
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

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="name">店舗名</InputLabel>
                <OutlinedInput
                  id="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange('name')}
                  label="name"
                />
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
                />
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
                />
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
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                <InputLabel htmlFor="street">町名番地</InputLabel>
                <OutlinedInput
                  id="street"
                  type="text"
                  value={values.street}
                  onChange={handleChange('street')}
                  label="street"
                />
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
