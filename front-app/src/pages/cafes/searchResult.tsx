// import { NextPage } from 'next'
// import Router from 'next/router'
import { Paper, Grid } from '@mui/material'
import React from 'react'
import CafeCard from 'components/elements/cafeCard'
import CustomPaper from 'components/layouts/customPaper'

export default function SearchResult() {
  var numbers: number[] = [1, 2, 3, 4]

  return (
    <CustomPaper>
      {numbers.map((item, index) => {
        return <CafeCard key={index} num={item} /> //keyを指定
      })}
    </CustomPaper>
  )
}
