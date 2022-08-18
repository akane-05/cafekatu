// import { NextPage } from 'next'
// import Router from 'next/router'
import { Grid, TextField, Button } from '@mui/material'
import React from 'react'

export default function SearchResult() {
  // const handleLink = (path: string) => {
  //   Router.push(path)
  // }

  return (
    <Grid container alignItems="center">
      <div>画面遷移</div>
      <TextField
        type="text"
        label="キーワード"
        required
        // value={name}
        // error={hasNameError}
        // onChange={inputName}
        // helperText={hasNameError ? '名前を入力してください。' : ''}
      />
      <Button variant="contained">検索</Button>
    </Grid>
  )
}
