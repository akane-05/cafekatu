// import { NextPage } from 'next'
// import Router from 'next/router'
import { Paper, Grid } from '@mui/material'
import React from 'react'
import CafeCard from '@/components/elements/CafeCard'
import CustomPaper from '@/components/layouts/CustomPaper'

import { useCafes } from '@/features/cafes/api/getCafes'
import { Cafe } from '@/features/cafes/types'

export default function CafesList() {
  const cafesQuery = useCafes()

  if (!cafesQuery.data) return 'データがありません'

  // if (cafesQuery.isLoading) {
  //   return (
  //     <div className="w-full h-48 flex justify-center items-center">
  //       <Spinner size="lg" />
  //     </div>
  //   )
  // }

  return (
    <CustomPaper>
      {cafesQuery.data.map((cafe: Cafe, index) => {
        return <CafeCard key={index} num={cafe.id} /> //keyを指定
      })}
    </CustomPaper>
  )
}
