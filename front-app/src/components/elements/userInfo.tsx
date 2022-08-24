// import { NextPage } from 'next'
// import Router from 'next/router'
import { Paper,Typography } from '@mui/material'
import React from 'react'
import Cafe from 'src/components/elements/cafe'

export default function UserInfo() {

  return (
    <Paper
      elevation={1}
      sx={{
        margin: 'auto',
        maxWidth: 700,
        padding: 2,
        backgroundColor: 'white',
      }}
      >

      <Typography
      variant="subtitle1"
      color="text.secondary"
      component="div"
    >
      email
    </Typography>

    <Typography
      variant="subtitle1"
      color="text.secondary"
      component="div"
    >
      ニックネーム
    </Typography>

    <Typography
      variant="subtitle1"
      color="text.secondary"
      component="div"
    >
      登録日
    </Typography>


    </Paper>
  )
}