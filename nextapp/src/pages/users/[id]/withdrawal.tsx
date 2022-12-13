// import { NextPage } from 'next'
// import Router from 'next/router'
import { Button, Grid, Paper, Typography, Link } from '@mui/material'
import React, { useState } from 'react'
import CustomPaper, { LinkPaper } from '@/components/elements/CustomPaper'
import theme from '@/styles/theme'
import { ThemeProvider } from '@mui/material/styles'
import { pagePath, errStatus } from '@/const/Consts'
import { useRouter } from 'next/router'
import * as Dialog from '@/context/MessageDialog'
import { deleteUser } from '@/features/users/api/deleteUser'
import { userInfoState, UserInfo } from '@/globalStates/userInfo'
import { useSetRecoilState, RecoilRoot } from 'recoil'
import { useUserInfo } from '@/hooks/useUserInfo'

export default function withdrawal() {
  const router = useRouter()
  const dialog = Dialog.useDialogContext()

  const { userInfo } = useUserInfo()
  const setUserInfo = useSetRecoilState(userInfoState)

  const handleLink = (path: string) => {
    router.push(path)
  }

  const deleteUserInfo = async () => {
    const response = await deleteUser(userInfo?.id)
    if (response.status == 200) {
      setUserInfo(undefined) //stateを空にする
      dialog.confirm(Dialog.apiOKDialog('退会しました'))
      console.log('どうなってる')
      handleLink(pagePath('top'))
    } else {
      if (errStatus.includes(response.status)) {
        router.push({
          pathname: pagePath('error'),
          query: { status: response.status, error: response.error },
        })
      } else {
        dialog.confirm(Dialog.apiErrorDialog(response.status, response.error))
      }
    }
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <LinkPaper elevation={0}>
          <Link
            onClick={() => handleLink(pagePath('mypage', String(userInfo?.id)))}
            component="button"
            variant="body1"
          >
            マイページ
          </Link>
        </LinkPaper>

        <CustomPaper sx={{ mt: 1 }}>
          <Paper sx={{ padding: 2 }}>
            <Grid item xs={12}>
              <Typography
                variant="h5"
                gutterBottom
                color="secondary"
                //sx={{ ml: 1 }}
              >
                退会
              </Typography>
            </Grid>
            <Typography variant="subtitle1" gutterBottom sx={{ mb: 2 }}>
              退会しますか？
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              退会後も投稿した口コミは削除されません。<br></br>
              本当に退会しますか？
            </Typography>

            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Button
                variant="contained"
                sx={{ mr: 2 }}
                onClick={() =>
                  handleLink(pagePath('mypage', String(userInfo?.id)))
                }
              >
                退会しない
              </Button>
              <Button onClick={deleteUserInfo}>退会する</Button>
            </Grid>
          </Paper>
        </CustomPaper>
      </ThemeProvider>
    </>
  )
}
