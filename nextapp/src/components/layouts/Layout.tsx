import Header from './Header'
import { ReactElement } from 'react'
import React from 'react'
import styles from '../../styles/layout.module.css'
import { Box } from '@mui/material'

type LayoutProps = Required<{
  readonly children: ReactElement
}>

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <Box sx={{ mb: 10 }}></Box>
      <main className={styles.container}>{children}</main>
    </>
  )
}
