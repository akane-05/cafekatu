import Header from './header'
import { ReactElement } from 'react'
import React from 'react'
import styles from '../../styles/layout.module.css'

type LayoutProps = Required<{
  readonly children: ReactElement
}>

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className={styles.container}>{children}</main>
    </>
  )
}
