// import { NextPage } from 'next'
// import Router from 'next/router'
import { Paper } from '@mui/material'
import React from 'react'
import Cafe from 'src/components/elements/cafe'

export default function SearchResult() {
  var numbers: number[] = [1, 2, 3, 4]

  return (
    <Paper
      elevation={1}
      sx={{
        margin: 'auto',
        maxWidth: 800,
        padding: 2,
        backgroundColor: 'F6F1F3',
      }}
    >
      {numbers.map((item, index) => {
        return <Cafe key={index} num={item} /> //keyを指定
      })}
    </Paper>
  )
}
